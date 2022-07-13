package commands

import (
	"backend/types"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
)

var weather_key = os.Getenv("WEATHER_KEY")

type WeatherData struct {
	Location struct {
		Name           string  `json:"name"`
		Region         string  `json:"region"`
		Country        string  `json:"country"`
		Lat            float64 `json:"lat"`
		Lon            float64 `json:"lon"`
		TzID           string  `json:"tz_id"`
		LocaltimeEpoch int     `json:"localtime_epoch"`
		Localtime      string  `json:"localtime"`
	} `json:"location"`
	Current struct {
		LastUpdatedEpoch int     `json:"last_updated_epoch"`
		LastUpdated      string  `json:"last_updated"`
		TempC            float64 `json:"temp_c"`
		TempF            float64 `json:"temp_f"`
		IsDay            int     `json:"is_day"`
		Condition        struct {
			Text string `json:"text"`
			Icon string `json:"icon"`
			Code int    `json:"code"`
		} `json:"condition"`
		WindMph    float64 `json:"wind_mph"`
		WindKph    float64 `json:"wind_kph"`
		WindDegree int     `json:"wind_degree"`
		WindDir    string  `json:"wind_dir"`
		PressureMb float64 `json:"pressure_mb"`
		PressureIn float64 `json:"pressure_in"`
		PrecipMm   float64 `json:"precip_mm"`
		PrecipIn   float64 `json:"precip_in"`
		Humidity   int     `json:"humidity"`
		Cloud      int     `json:"cloud"`
		FeelslikeC float64 `json:"feelslike_c"`
		FeelslikeF float64 `json:"feelslike_f"`
		VisKm      float64 `json:"vis_km"`
		VisMiles   float64 `json:"vis_miles"`
		Uv         float64 `json:"uv"`
		GustMph    float64 `json:"gust_mph"`
		GustKph    float64 `json:"gust_kph"`
	} `json:"current"`
	Forecast struct {
		Forecastday []struct {
			Date      string `json:"date"`
			DateEpoch int    `json:"date_epoch"`
			Day       struct {
				MaxtempC          float64 `json:"maxtemp_c"`
				MaxtempF          float64 `json:"maxtemp_f"`
				MintempC          float64 `json:"mintemp_c"`
				MintempF          float64 `json:"mintemp_f"`
				AvgtempC          float64 `json:"avgtemp_c"`
				AvgtempF          float64 `json:"avgtemp_f"`
				MaxwindMph        float64 `json:"maxwind_mph"`
				MaxwindKph        float64 `json:"maxwind_kph"`
				TotalprecipMm     float64 `json:"totalprecip_mm"`
				TotalprecipIn     float64 `json:"totalprecip_in"`
				AvgvisKm          float64 `json:"avgvis_km"`
				AvgvisMiles       float64 `json:"avgvis_miles"`
				Avghumidity       float64 `json:"avghumidity"`
				DailyWillItRain   int     `json:"daily_will_it_rain"`
				DailyChanceOfRain int     `json:"daily_chance_of_rain"`
				DailyWillItSnow   int     `json:"daily_will_it_snow"`
				DailyChanceOfSnow int     `json:"daily_chance_of_snow"`
				Condition         struct {
					Text string `json:"text"`
					Icon string `json:"icon"`
					Code int    `json:"code"`
				} `json:"condition"`
				Uv float64 `json:"uv"`
			} `json:"day"`
			Astro struct {
				Sunrise          string `json:"sunrise"`
				Sunset           string `json:"sunset"`
				Moonrise         string `json:"moonrise"`
				Moonset          string `json:"moonset"`
				MoonPhase        string `json:"moon_phase"`
				MoonIllumination string `json:"moon_illumination"`
			} `json:"astro"`
			Hour []struct {
				TimeEpoch int     `json:"time_epoch"`
				Time      string  `json:"time"`
				TempC     float64 `json:"temp_c"`
				TempF     float64 `json:"temp_f"`
				IsDay     int     `json:"is_day"`
				Condition struct {
					Text string `json:"text"`
					Icon string `json:"icon"`
					Code int    `json:"code"`
				} `json:"condition"`
				WindMph      float64 `json:"wind_mph"`
				WindKph      float64 `json:"wind_kph"`
				WindDegree   int     `json:"wind_degree"`
				WindDir      string  `json:"wind_dir"`
				PressureMb   float64 `json:"pressure_mb"`
				PressureIn   float64 `json:"pressure_in"`
				PrecipMm     float64 `json:"precip_mm"`
				PrecipIn     float64 `json:"precip_in"`
				Humidity     int     `json:"humidity"`
				Cloud        int     `json:"cloud"`
				FeelslikeC   float64 `json:"feelslike_c"`
				FeelslikeF   float64 `json:"feelslike_f"`
				WindchillC   float64 `json:"windchill_c"`
				WindchillF   float64 `json:"windchill_f"`
				HeatindexC   float64 `json:"heatindex_c"`
				HeatindexF   float64 `json:"heatindex_f"`
				DewpointC    float64 `json:"dewpoint_c"`
				DewpointF    float64 `json:"dewpoint_f"`
				WillItRain   int     `json:"will_it_rain"`
				ChanceOfRain int     `json:"chance_of_rain"`
				WillItSnow   int     `json:"will_it_snow"`
				ChanceOfSnow int     `json:"chance_of_snow"`
				VisKm        float64 `json:"vis_km"`
				VisMiles     float64 `json:"vis_miles"`
				GustMph      float64 `json:"gust_mph"`
				GustKph      float64 `json:"gust_kph"`
				Uv           float64 `json:"uv"`
			} `json:"hour"`
		} `json:"forecastday"`
	} `json:"forecast"`
}

func weather(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	location, _ := data.GetOption("location")
	resp, err := http.Get(fmt.Sprintf("https://api.weatherapi.com/v1/forecast.json?key=%s&days=1&q=%s", weather_key, url.QueryEscape(location.StringValue())))
	if err != nil {
		fmt.Println(err)
		i.Error("Unable to load weather data.")
		return
	}

	defer resp.Body.Close()
	var weather WeatherData
	if err = json.NewDecoder(resp.Body).Decode(&weather); err != nil {
		fmt.Println(err)
		i.Error("Unable to load weather data.")
		return
	}

	units, unitsErr := data.GetOption("units")

	embed := types.Embed{
		URL: fmt.Sprintf("https://darksky.net/forecast/%f,%f/", weather.Location.Lat, weather.Location.Lon),
		Thumbnail: types.EmbedImage{
			URL: "https:" + weather.Current.Condition.Icon,
		},
		Footer: types.EmbedFooter{
			Text: fmt.Sprintf("Conditions in %s, %s", weather.Location.Name, weather.Location.Region),
		},
		Fields: []types.EmbedField{
			{
				Name:   "☀️ Sunrise",
				Value:  weather.Forecast.Forecastday[0].Astro.Sunrise,
				Inline: true,
			},
			{
				Name:   fmt.Sprintf(":%s: Sunset", moonPhaseEmoji(weather.Forecast.Forecastday[0].Astro.MoonPhase)),
				Value:  weather.Forecast.Forecastday[0].Astro.Sunset,
				Inline: true,
			},
			{
				Name:   "\u200B",
				Value:  "\u200B",
				Inline: true,
			},
			{
				Name:   "Wind",
				Value:  "",
				Inline: true,
			},
			{
				Name:   "Humidity",
				Value:  fmt.Sprintf("%d%%", weather.Current.Humidity),
				Inline: true,
			},
			{
				Name:   "Visibility",
				Value:  "",
				Inline: true,
			},
		},
	}

	rainChance := weather.Forecast.Forecastday[0].Day.DailyChanceOfRain
	snowChance := weather.Forecast.Forecastday[0].Day.DailyChanceOfSnow

	if rainChance > 0 {
		embed.Description = fmt.Sprintf("There is a %d%% chance of rain", rainChance)
		if snowChance > 0 {
			embed.Description += fmt.Sprintf(" and a %d%% chance of snow.", snowChance)
		} else {
			embed.Description += "."
		}
	} else if snowChance > 0 {
		embed.Description = fmt.Sprintf("There is a %d%% chance of snow.", snowChance)
	}

	if (unitsErr == nil && units.StringValue() == "metric") || weather.Location.Country != "United States of America" {
		embed.Title = fmt.Sprintf("%.1f°C, %s", weather.Current.TempC, weather.Current.Condition.Text)
		embed.Fields[3].Value = fmt.Sprintf("%.1f kph %s", weather.Current.WindKph, weather.Current.WindDir)
		embed.Fields[5].Value = fmt.Sprintf("%.1f km", weather.Current.VisKm)
	} else {
		embed.Title = fmt.Sprintf("%.1f°F, %s", weather.Current.TempF, weather.Current.Condition.Text)
		embed.Fields[3].Value = fmt.Sprintf("%.1f mph %s", weather.Current.WindMph, weather.Current.WindDir)
		embed.Fields[5].Value = fmt.Sprintf("%.1f mi", weather.Current.VisMiles)
	}

	i.Respond(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Embeds: []*types.Embed{&embed},
		},
	})

}

func moonPhaseEmoji(phase string) string {
	phase = strings.ToLower(phase)
	if strings.Contains(phase, "moon") {
		return strings.ReplaceAll(phase, " ", "_")
	} else {
		return strings.ReplaceAll(phase+" moon", " ", "_")
	}
}
