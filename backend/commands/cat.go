package commands

import (
	"backend/types"
	"io"
	"net/http"
)

func cat(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	resp, err := http.Get("https://api.thecatapi.com/v1/images/search?format=src")
	if err != nil {
		i.Respond(types.InteractionResponse{
			Type: types.ResponseChannelMessageWithSource,
			Data: types.ResponseData{
				Content: "Error finding a cat.",
				Flags:   types.FlagEphemeral,
			},
		})
	}

	i.RespondWithFile(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Attachments: []types.Attachment{{
				Filename:    "cat.jpg",
				Description: "A cute little kitty",
				ID:          0,
			}},
		},
	}, []io.Reader{resp.Body})
}
