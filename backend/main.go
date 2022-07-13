package main

import (
	"backend/commands"
	"backend/types"
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"strconv"
)

var (
	port      = flag.Int("port", 3000, "The port to listen to requests on")
	publicKey = flag.String("pubkey", "", "The public key for requests")
)

func init() {
	flag.Parse()
}

func main() {
	http.HandleFunc("/interactions", interactions)
	http.ListenAndServe(":"+strconv.Itoa(*port), nil)
}

func interactions(w http.ResponseWriter, r *http.Request) {
	if !verify(r) {
		http.Error(w, "Bad signature", http.StatusUnauthorized)
		return
	}

	defer r.Body.Close()

	// Decode data
	var data types.Interaction
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		log.Println(err)
		http.Error(w, "Unable to parse interaction", http.StatusInternalServerError)
		return
	}

	switch data.Type {
	// Send pong response if it's a ping
	case types.InteractionPing:
		err := json.NewEncoder(w).Encode(types.InteractionResponse{
			Type: types.ResponsePong,
		})
		if err != nil {
			log.Println(err)
		}
	case types.InteractionApplicationCommand:
		commands.HandleCommands(w, data)
	}

}
