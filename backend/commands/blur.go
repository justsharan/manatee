package commands

import (
	"backend/types"
	"bytes"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"net/http"

	"github.com/esimov/stackblur-go"
)

func init() {
	image.RegisterFormat("jpeg", "jpeg", jpeg.Decode, jpeg.DecodeConfig)
	image.RegisterFormat("gif", "gif", gif.Decode, gif.DecodeConfig)
	image.RegisterFormat("png", "png", png.Decode, png.DecodeConfig)
}

func blur(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	// Get link to the attachment
	attachedID, _ := data.GetOption("image")
	attachment := data.Resolved.Attachments[attachedID.StringValue()].URL

	// Retrieve the image itself
	resp, err := http.Get(attachment)
	if err != nil {
		fmt.Println(err)
		i.Error("Error retrieving attachment")
		return
	}

	// Read the contents of the image
	defer resp.Body.Close()
	img, _, err := image.Decode(resp.Body)
	if err != nil {
		fmt.Println(err)
		i.Error("Error loading the image you sent")
		return
	}

	// Convert image to grayscale
	blurred, err := stackblur.Process(img, 10)
	if err != nil {
		fmt.Println(err)
		i.Error("Error blurring image")
		return
	}

	// Get raw bytes of grayscaled image
	res := new(bytes.Buffer)
	png.Encode(res, blurred)

	// Respond with grayscaled image
	err = i.RespondWithFile(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Content: "Here's your grayscaled image.",
			Attachments: []types.Attachment{{
				Filename:    "grayscaled.png",
				Description: "Your image with a grayscale filter",
				ID:          "0",
			}},
		},
	}, []*bytes.Buffer{res})
	if err != nil {
		fmt.Println(err)
	}
}
