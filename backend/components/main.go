package components

import (
	"backend/types"
	"net/http"
)

func HandleComponents(w http.ResponseWriter, i *types.Interaction) {
	i.SetResponseWriter(w)
	data := i.MessageComponentData()
	switch data.CustomID {
	case "cat_reload":
		catReload(i, data)
	}
}
