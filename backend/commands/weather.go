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
		Name    string  `json:"name"`
		Region  string  `json:"region"`
		Country string  `json:"country"`
		Lat     float64 `json:"lat"`
		Lon     float64 `json:"lon"`
	} `json:"location"`
	Current struct {
		TempC     float64 `json:"temp_c"`
		TempF     float64 `json:"temp_f"`
		Condition struct {
			Text string `json:"text"`
			Icon string `json:"icon"`
		} `json:"condition"`
		WindMph  float64 `json:"wind_mph"`
		WindKph  float64 `json:"wind_kph"`
		WindDir  string  `json:"wind_dir"`
		Humidity int     `json:"humidity"`
		VisKm    float64 `json:"vis_km"`
		VisMiles float64 `json:"vis_miles"`
	} `json:"current"`
	Forecast struct {
		Forecastday []struct {
			Day struct {
				DailyChanceOfRain int `json:"daily_chance_of_rain"`
				DailyChanceOfSnow int `json:"daily_chance_of_snow"`
			} `json:"day"`
			Astro struct {
				Sunrise   string `json:"sunrise"`
				Sunset    string `json:"sunset"`
				MoonPhase string `json:"moon_phase"`
			} `json:"astro"`
		} `json:"forecastday"`
	} `json:"forecast"`
}

func weather(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	// Retrieve weather data from API
	location, _ := data.GetOption("location")
	resp, err := http.Get(fmt.Sprintf("https://api.weatherapi.com/v1/forecast.json?key=%s&days=1&q=%s", weather_key, url.QueryEscape(location.StringValue())))
	if err != nil {
		fmt.Println(err)
		i.Error("Unable to load weather data.")
		return
	}

	// Get weather data
	defer resp.Body.Close()
	var weather WeatherData
	if err = json.NewDecoder(resp.Body).Decode(&weather); err != nil {
		fmt.Println(err)
		i.Error("Unable to load weather data.")
		return
	}

	units, unitsErr := data.GetOption("units")

	// Basic embed
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

	// Shortcuts for rain and snow data
	rainChance := weather.Forecast.Forecastday[0].Day.DailyChanceOfRain
	snowChance := weather.Forecast.Forecastday[0].Day.DailyChanceOfSnow

	// Add rain/snow warnings as appropriate
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

	// Add imperial/metric data where appropriate
	if (unitsErr == nil && units.StringValue() == "metric") || weather.Location.Country != "United States of America" {
		embed.Title = fmt.Sprintf("%.1f°C, %s", weather.Current.TempC, weather.Current.Condition.Text)
		embed.Fields[3].Value = fmt.Sprintf("%.1f kph %s", weather.Current.WindKph, weather.Current.WindDir)
		embed.Fields[5].Value = fmt.Sprintf("%.1f km", weather.Current.VisKm)
	} else {
		embed.Title = fmt.Sprintf("%.1f°F, %s", weather.Current.TempF, weather.Current.Condition.Text)
		embed.Fields[3].Value = fmt.Sprintf("%.1f mph %s", weather.Current.WindMph, weather.Current.WindDir)
		embed.Fields[5].Value = fmt.Sprintf("%.1f mi", weather.Current.VisMiles)
	}

	// Respond with weather data
	i.Respond(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Embeds: []*types.Embed{&embed},
		},
	})

}

// Format sunset emoji with the right moon phase
func moonPhaseEmoji(phase string) string {
	phase = strings.ToLower(phase)
	if strings.Contains(phase, "moon") {
		return strings.ReplaceAll(phase, " ", "_")
	} else {
		return strings.ReplaceAll(phase+" moon", " ", "_")
	}
}
