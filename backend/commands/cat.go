package commands

import (
	"backend/types"
)

func cat(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	i.Respond(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Content: "Here's a kitty!",
		},
	})
}
