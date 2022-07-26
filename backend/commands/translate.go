package commands

import (
	"backend/types"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type Translation struct {
	Text        string `json:"text"`
	UserLang    string `json:"userLang"`
	Translation string `json:"translation"`
	Language    struct {
		From  string `json:"from"`
		To    string `json:"to"`
		Score int    `json:"score"`
	} `json:"language"`
	CorrectedText string `json:"correctedText"`
}

func translate(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	text := data.Resolved.Messages[string(data.TargetID)].Content
	lang := i.Locale

	resp, err := http.Get(fmt.Sprintf("https://bingtrans.vercel.app/api/?lang=%s&text=%s", lang[0:2], url.QueryEscape(text)))
	if err != nil || resp.StatusCode != http.StatusOK {
		i.Error("Couldn't translate message")
	}

	defer resp.Body.Close()
	var translated Translation
	if err = json.NewDecoder(resp.Body).Decode(&translated); err != nil {
		i.Error("Couldn't translate message")
	}

	i.Respond(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Content: translated.Translation,
			Flags:   types.FlagEphemeral,
		},
	})
}
