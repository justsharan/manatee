package commands

import (
	"backend/types"
	"net/http"
)

func HandleCommands(w http.ResponseWriter, i *types.Interaction) {
	i.SetResponseWriter(w)
	data := i.ApplicationCommandData()
	switch data.Name {
	case "advice":
		advice(i, data)
	case "blur":
		blur(i, data)
	case "cat":
		cat(i, data)
	case "grayscale":
		grayscale(i, data)
	case "ip":
		ip(i, data)
	case "map":
		googleMap(i, data)
	case "movie":
		movie(i, data)
	case "pixelate":
		pixelate(i, data)
	case "sepia":
		sepia(i, data)
	case "Translate":
		translate(i, data)
	case "trivia":
		trivia(i, data)
	case "weather":
		weather(i, data)
	}
}
