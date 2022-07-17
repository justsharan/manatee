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

	"github.com/disintegration/gift"
)

func init() {
	image.RegisterFormat("jpeg", "jpeg", jpeg.Decode, jpeg.DecodeConfig)
	image.RegisterFormat("gif", "gif", gif.Decode, gif.DecodeConfig)
	image.RegisterFormat("png", "png", png.Decode, png.DecodeConfig)
}

func pixelate(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
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

	// Pixelate image
	pixelated := image.NewRGBA(img.Bounds())
	g := gift.New(gift.Pixelate(5))
	g.Draw(pixelated, img)

	// Get raw bytes of pixelated image
	res := new(bytes.Buffer)
	png.Encode(res, pixelated)

	// Respond with pixelated image
	err = i.RespondWithFile(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Attachments: []types.Attachment{{
				Filename:    "pixelated.png",
				Description: "Your image but pixelated",
				ID:          "0",
			}},
		},
	}, []*bytes.Buffer{res})
	if err != nil {
		fmt.Println(err)
	}
}
