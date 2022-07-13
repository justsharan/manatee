package components

import (
	"backend/types"
	"encoding/json"
	"fmt"
)

func trivia(i *types.Interaction, data *types.MessageComponentInteractionData) {
	options := types.ActionRow{
		Type:       types.ComponentActionRow,
		Components: []interface{}{},
	}

	for _, choice := range i.Message.Components[0].Components {
		encoded, _ := json.Marshal(choice)
		var btn types.Button
		_ = json.Unmarshal(encoded, &btn)

		var style types.ButtonStyle
		if data.CustomID == "correct" {
			if btn.CustomID == "correct" {
				style = types.ButtonSuccess
			} else {
				style = types.ButtonSecondary
			}
		} else if data.CustomID == btn.CustomID {
			style = types.ButtonDanger
		} else if btn.CustomID == "correct" {
			style = types.ButtonSuccess
		} else {
			style = types.ButtonSecondary
		}

		options.Components = append(options.Components, types.Button{
			Type:     types.ComponentButton,
			Label:    btn.Label,
			Disabled: true,
			CustomID: btn.CustomID,
			Style:    style,
		})
	}

	err := i.Respond(types.InteractionResponse{
		Type: types.ResponseUpdateMessage,
		Data: types.ResponseData{
			Content:    i.Message.Content,
			Components: []interface{}{options},
		},
	})

	if err != nil {
		fmt.Println(err)
	}
}
