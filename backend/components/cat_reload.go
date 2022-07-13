package components

import (
	"backend/commands"
	"backend/types"
	"encoding/json"
	"fmt"
	"net/http"
)

func catReload(i *types.Interaction, data *types.MessageComponentInteractionData) {
	resp, err := http.Get("https://api.thecatapi.com/v1/images/search")
	if err != nil {
		i.Respond(types.InteractionResponse{
			Type: types.ResponseChannelMessageWithSource,
			Data: types.ResponseData{
				Content: "Error finding a cat.",
				Flags:   types.FlagEphemeral,
			},
		})
	}

	var details []commands.CatDetails

	defer resp.Body.Close()
	if err = json.NewDecoder(resp.Body).Decode(&details); err != nil {
		i.Respond(types.InteractionResponse{
			Type: types.ResponseChannelMessageWithSource,
			Data: types.ResponseData{
				Content: "Error finding a cat.",
				Flags:   types.FlagEphemeral,
			},
		})
	}

	err = i.Respond(types.InteractionResponse{
		Type: types.ResponseUpdateMessage,
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
