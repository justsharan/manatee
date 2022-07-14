package types

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
)

type Snowflake string

type Interaction struct {
	ID             Snowflake              `json:"id"`
	ApplicationID  Snowflake              `json:"application_id"`
	Type           InteractionType        `json:"type"`
	Data           map[string]interface{} `json:"data"`
	GuildID        Snowflake              `json:"guild_id"`
	ChannelID      Snowflake              `json:"channel_id"`
	Member         interface{}            `json:"member"`
	User           User                   `json:"user"`
	Token          string                 `json:"token"`
	Version        uint8                  `json:"version"`
	Message        Message                `json:"message"`
	AppPermissions uint64                 `json:"app_permissions,string"`
	Locale         string                 `json:"locale"`
	GuildLocale    string                 `json:"guild_locale"`
	ResponseWriter http.ResponseWriter    `json:"-"`
}

func (i *Interaction) SetResponseWriter(w http.ResponseWriter) {
	i.ResponseWriter = w
}

func (i *Interaction) Respond(resp InteractionResponse) error {
	i.ResponseWriter.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(i.ResponseWriter).Encode(resp)
}

func (i *Interaction) Error(message string) error {
	return i.Respond(InteractionResponse{
		Type: ResponseChannelMessageWithSource,
		Data: ResponseData{
			Content: message,
			Flags:   FlagEphemeral,
		},
	})
}

func (i *Interaction) RespondWithFile(resp InteractionResponse, files []io.Reader) error {
	if len(resp.Data.Attachments) != len(files) {
		return errors.New("number of attachment objects doesn't equal number of files")
	}

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	for i, file := range files {
		fmt.Println(i)
		part, _ := writer.CreateFormFile(fmt.Sprintf("files[%d]", i), resp.Data.Attachments[i].Filename)
		io.Copy(part, file)
	}

	field, _ := writer.CreateFormField("payload_json")
	if err := json.NewEncoder(field).Encode(resp); err != nil {
		return err
	}

	writer.Close()

	_, err := http.Post(
		fmt.Sprintf("https://discord.com/api/v10/interactions/%s/%s/callback", i.ID, i.Token),
		writer.FormDataContentType(),
		body,
	)
	if err != nil {
		return err
	}

	i.ResponseWriter.WriteHeader(200)
	return nil
}

func (i Interaction) ApplicationCommandData() *ApplicationCommandInteractionData {
	data, _ := json.Marshal(i.Data)
	var res ApplicationCommandInteractionData
	_ = json.Unmarshal(data, &res)
	return &res
}

func (i Interaction) MessageComponentData() *MessageComponentInteractionData {
	data, _ := json.Marshal(i.Data)
	var res MessageComponentInteractionData
	_ = json.Unmarshal(data, &res)
	return &res
}

func (i Interaction) ModalSubmitData() *ModalSubmitInteractionData {
	data, _ := json.Marshal(i.Data)
	var res ModalSubmitInteractionData
	_ = json.Unmarshal(data, &res)
	return &res
}

type InteractionType uint8

const (
	InteractionPing                           InteractionType = 1
	InteractionApplicationCommand             InteractionType = 2
	InteractionMessageComponent               InteractionType = 3
	InteractionApplicationCommandAutocomplete InteractionType = 4
	InteractionModalSubmit                    InteractionType = 5
)

type ApplicationCommandInteractionData struct {
	ID       Snowflake                                 `json:"id"`
	Name     string                                    `json:"name"`
	Type     CommandType                               `json:"type"`
	Resolved ApplicationCommandInteractionDataResolved `json:"resolved"`
	Options  []ApplicationCommandInteractionDataOption `json:"options"`
	GuildID  Snowflake                                 `json:"guild_id"`
	TargetID Snowflake                                 `json:"target_id"`
}

func (data ApplicationCommandInteractionData) GetOption(name string) (ApplicationCommandInteractionDataOption, error) {
	for _, option := range data.Options {
		if option.Name == name {
			return option, nil
		}
	}
	return ApplicationCommandInteractionDataOption{}, errors.New("no option found by that name")
}

type CommandType uint8

const (
	CommandChatInput CommandType = 1
	CommandUser      CommandType = 2
	CommandMessage   CommandType = 3
)

type ApplicationCommandInteractionDataResolved struct {
	Users       map[string]*User       `json:"users"`
	Members     map[string]interface{} `json:"members"`
	Roles       map[string]interface{} `json:"roles"`
	Channels    map[string]interface{} `json:"channels"`
	Messages    map[string]*Message    `json:"messages"`
	Attachments map[string]*Attachment `json:"attachments"`
}

type ApplicationCommandInteractionDataOption struct {
	Name    string                                     `json:"name"`
	Type    OptionType                                 `json:"type"`
	Value   interface{}                                `json:"value,omitempty"`
	Options []*ApplicationCommandInteractionDataOption `json:"options,omitempty"`
	Focused bool                                       `json:"focused,omitempty"`
}

func (opt ApplicationCommandInteractionDataOption) StringValue() string {
	return opt.Value.(string)
}

func (opt ApplicationCommandInteractionDataOption) IntValue() float64 {
	return opt.Value.(float64)
}

type OptionType uint8

const (
	OptionSubCommand      OptionType = 1
	OptionSubCommandGroup OptionType = 2
	OptionString          OptionType = 3
	OptionInteger         OptionType = 4
	OptionBoolean         OptionType = 5
	OptionUser            OptionType = 6
	OptionChannel         OptionType = 7
	OptionRole            OptionType = 8
	OptionMentionable     OptionType = 9
	OptionNumber          OptionType = 10
	OptionAttachment      OptionType = 11
)

type MessageComponentInteractionData struct {
	CustomID      string        `json:"custom_id"`
	ComponentType ComponentType `json:"component_type"`
	Values        []string      `json:"values,omitempty"`
}

type ModalSubmitInteractionData struct {
	CustomID   string        `json:"custom_id"`
	Components []interface{} `json:"components"`
}

type InteractionResponse struct {
	Type ResponseType `json:"type,omitempty"`
	Data ResponseData `json:"data"`
}

type ResponseType uint8

const (
	ResponsePong                             ResponseType = 1
	ResponseChannelMessageWithSource         ResponseType = 4
	ResponseDeferredChannelMessageWithSource ResponseType = 5
	ResponseDeferredUpdateMessage            ResponseType = 6
	ResponseUpdateMessage                    ResponseType = 7
	ResponseAutocompleteResult               ResponseType = 8
	ResponseModal                            ResponseType = 9
)

type ResponseData struct {
	TTS             bool            `json:"tts,omitempty"`
	Content         string          `json:"content,omitempty"`
	Components      []interface{}   `json:"components,omitempty"`
	Embeds          []*Embed        `json:"embeds,omitempty"`
	AllowedMentions AllowedMentions `json:"allowed_mentions,omitempty"`
	Attachments     []Attachment    `json:"attachments,omitempty"`
	Flags           MessageFlags    `json:"flags,omitempty"`
	Choices         []*OptionChoice `json:"choices,omitempty"`
	CustomID        string          `json:"custom_id,omitempty"`
	Title           string          `json:"title,omitempty"`
}

type OptionChoice struct {
	Name              string            `json:"name"`
	NameLocalizations map[string]string `json:"name_localizations,omitempty"`
	Value             interface{}       `json:"value"`
}
