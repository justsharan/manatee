package commands

import (
	"backend/types"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"net/url"
	"time"
)

type TriviaQuestion struct {
	ResponseCode int `json:"response_code"`
	Results      []struct {
		Category         string   `json:"category"`
		Type             string   `json:"type"`
		Difficulty       string   `json:"difficulty"`
		Question         string   `json:"question"`
		CorrectAnswer    string   `json:"correct_answer"`
		IncorrectAnswers []string `json:"incorrect_answers"`
	} `json:"results"`
}

func trivia(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	baseURL := "https://opentdb.com/api.php?amount=1&encode=url3986"
	if category, err := data.GetOption("category"); err == nil {
		baseURL += "&category=" + category.StringValue()
	}
	if difficulty, err := data.GetOption("difficulty"); err == nil {
		baseURL += "&difficulty=" + difficulty.StringValue()
	}

	resp, err := http.Get(baseURL)
	if err != nil {
		fmt.Println(err)
		i.Error("Error finding a trivia question.")
		return
	}

	defer resp.Body.Close()
	var question TriviaQuestion
	if err = json.NewDecoder(resp.Body).Decode(&question); err != nil {
		fmt.Println(err)
		i.Error("Error reading the trivia question.")
		return
	}

	options := types.ActionRow{
		Type:       types.ComponentActionRow,
		Components: []interface{}{},
	}

	correctAnswer, _ := url.QueryUnescape(question.Results[0].CorrectAnswer)
	options.Components = append(options.Components, types.Button{
		Type:     types.ComponentButton,
		Style:    types.ButtonSecondary,
		CustomID: "correct",
		Label:    correctAnswer,
	})

	for i, answer := range question.Results[0].IncorrectAnswers {
		decoded, _ := url.QueryUnescape(answer)
		options.Components = append(options.Components, types.Button{
			Type:     types.ComponentButton,
			Style:    types.ButtonSecondary,
			CustomID: fmt.Sprintf("incorrect_%d", i),
			Label:    decoded,
		})
	}

	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(options.Components), func(i, j int) {
		options.Components[i], options.Components[j] = options.Components[j], options.Components[i]
	})

	decodedQuestion, _ := url.QueryUnescape(question.Results[0].Question)
	i.Respond(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Content:    decodedQuestion,
			Components: []interface{}{options},
		},
	})

}
