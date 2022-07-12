package main

import (
	"crypto/ed25519"
	"flag"
	"net/http"
	"strconv"
)

var (
	port = flag.Int("port", 3000, "The port to listen to requests on")
	publicKey = flag.String("pubkey", "", "The public key for requests")
)

func init() {
	flag.Parse()
}

func main() {
	http.HandleFunc("/interactions", interactions)
	http.ListenAndServe(":" + strconv.Itoa(*port), nil)
}

func interactions(w http.ResponseWriter, r *http.Request) {
	verified := verify(r, ed25519.PublicKey(*publicKey))
	if !verified {
		http.Error(w, "Bad signature", http.StatusUnauthorized)
		return
	}

	defer r.Body.Close()
	// Handle request
}
