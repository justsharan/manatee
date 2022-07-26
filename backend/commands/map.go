package commands

import (
	"backend/types"
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
)

var mapsKey = os.Getenv("MAPS_KEY")

func googleMap(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	center, _ := data.GetOption("location")
	maptypeOption, err := data.GetOption("type")

	var maptype string
	if err != nil {
		maptype = ""
	} else {
		maptype = maptypeOption.StringValue()
	}

	res, err := getGoogleMap(url.QueryEscape(center.StringValue()), maptype, "", 0)
	if err != nil {
		i.Error("Couldn't get a map for that location")
	}

	i.RespondWithFile(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Attachments: []types.Attachment{{
				Filename:    "map.png",
				Description: "Your map",
				ID:          "0",
			}},
		},
	}, []*bytes.Buffer{bytes.NewBuffer(res)})
}

func getGoogleMap(center, maptype, language string, zoom int) ([]byte, error) {
	url := "https://maps.googleapis.com/maps/api/staticmap?size=600x500&scale=2&center=" + center
	if maptype != "" {
		url += "&maptype=" + maptype
	}
	if language != "" {
		url += "&language=" + language
	}
	if zoom != 0 {
		url += "&zoom=" + fmt.Sprint(zoom)
	}
	resp, err := http.Get(url + "&key=" + mapsKey)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}
