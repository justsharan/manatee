package commands

import (
	"backend/types"
	"encoding/json"
	"fmt"
	"net/http"
)

type CatDetails struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

func cat(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	resp, err := http.Get("https://api.thecatapi.com/v1/images/search")
	if err != nil {
		fmt.Println(err)
		i.Error("Error finding a cat.")
		return
	}

	var details []CatDetails

	defer resp.Body.Close()
	if err = json.NewDecoder(resp.Body).Decode(&details); err != nil {
		fmt.Println(err)
		i.Error("Error finding a cat.")
		return
	}

	err = i.Respond(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Content: details[0].URL,
			Components: []interface{}{
				types.ActionRow{
					Type: types.ComponentActionRow,
					Components: []interface{}{
						types.Button{
							Type:     types.ComponentButton,
							CustomID: "cat_reload",
							Style:    types.ButtonSecondary,
							Emoji:    types.ComponentEmoji{Name: "🐱"},
							Label:    "New Cat!",
						},
					},
				},
			},
		},
	})

	if err != nil {
		fmt.Println(err)
	}
}
