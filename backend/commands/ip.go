package commands

import (
	"backend/types"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

type IPInfo struct {
	Status      string  `json:"status"`
	Country     string  `json:"country"`
	CountryCode string  `json:"countryCode"`
	Region      string  `json:"region"`
	RegionName  string  `json:"regionName"`
	City        string  `json:"city"`
	Zip         string  `json:"zip"`
	Lat         float64 `json:"lat"`
	Lon         float64 `json:"lon"`
	Timezone    string  `json:"timezone"`
	Isp         string  `json:"isp"`
	Org         string  `json:"org"`
	As          string  `json:"as"`
	Query       string  `json:"query"`
}

func ip(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	address, _ := data.GetOption("address")
	resp, err := http.Get("http://ip-api.com/json/" + url.QueryEscape(address.StringValue()) + "&lang=" + i.GuildLocale)
	if err != nil {
		i.Error("Error retrieving info about the IP addrees")
		return
	}

	defer resp.Body.Close()
	var info IPInfo
	if err = json.NewDecoder(resp.Body).Decode(&info); err != nil {
		i.Error("Error retrieving info about the IP address")
		return
	}

	if info.Status == "fail" {
		i.Error("That's not a valid IPv4 or IPv6 address")
		return
	}

	location, err := getGoogleMap(fmt.Sprintf("{%.5f,%.5f}", info.Lat, info.Lon), "", "", 12)
	if err != nil {
		i.Error("Error getting a map of that location")
	}

	i.RespondWithFile(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Content: fmt.Sprintf("Information about **%s**\n📍 %s, %s, %s :flag_%s:", info.Query, info.City, info.Region, info.Country, strings.ToLower(info.CountryCode)),
			Attachments: []types.Attachment{{
				Filename:    "location.png",
				Description: "The location of that IP address",
				ID:          "0",
			}},
		},
	}, []*bytes.Buffer{bytes.NewBuffer(location)})
}
