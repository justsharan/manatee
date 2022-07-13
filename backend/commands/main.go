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
	case "cat":
		cat(i, data)
	}
}
