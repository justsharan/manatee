package commands

import (
	"backend/types"
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/gif"
	"image/jpeg"
	"image/png"
	"net/http"
)

func init() {
	image.RegisterFormat("jpeg", "jpeg", jpeg.Decode, jpeg.DecodeConfig)
	image.RegisterFormat("gif", "gif", gif.Decode, gif.DecodeConfig)
	image.RegisterFormat("png", "png", png.Decode, png.DecodeConfig)
}

func sepia(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
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

	// Convert image to sepia
	sepia := image.NewRGBA(img.Bounds())
	for x := 0; x < img.Bounds().Max.X; x++ {
		for y := 0; y < img.Bounds().Max.Y; y++ {
			R, G, B, _ := img.At(x, y).RGBA()
			brightness := uint8((0.34 * float64(R)) + (0.5 * float64(G)) + (0.16 * float64(B)))
			sepiaColor := color.RGBA{R: brightness + 100, G: brightness + 50, B: brightness}
			sepia.SetRGBA(x, y, sepiaColor)
		}
	}

	// Get raw bytes of sepia image
	res := new(bytes.Buffer)
	png.Encode(res, sepia)

	// Respond with sepia image
	err = i.RespondWithFile(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Content: "Here's your image with a sepia filter.",
			Attachments: []types.Attachment{{
				Filename:    "sepia.png",
				Description: "Your image with a sepia filter",
				ID:          "0",
			}},
		},
	}, []*bytes.Buffer{res})
	if err != nil {
		fmt.Println(err)
	}
}
