package commands

import (
	"backend/types"
	"encoding/json"
	"fmt"
	"net/http"
)

type Advice struct {
	Slip Slip `json:"slip"`
}

type Slip struct {
	ID     uint   `json:"id"`
	Advice string `json:"advice"`
}

func advice(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	// Retrieve advice
	resp, err := http.Get("https://api.adviceslip.com/advice")
	if err != nil {
		fmt.Println(err)
		i.Error("Error retrieving advice")
		return
	}

	// Get advice data
	defer resp.Body.Close()
	var advice Advice
	json.NewDecoder(resp.Body).Decode(&advice)

	// Respond with advice
	i.Respond(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Content: advice.Slip.Advice,
		},
	})
}
