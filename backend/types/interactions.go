package types

type Snowflake string

type Interaction struct {
	ID             Snowflake       `json:"id"`
	ApplicationID  Snowflake       `json:"application_id"`
	Type           InteractionType `json:"type"`
	Data           interface{}     `json:"data"`
	GuildID        Snowflake       `json:"guild_id"`
	ChannelID      Snowflake       `json:"channel_id"`
	Member         interface{}     `json:"member"`
	User           User            `json:"user"`
	Token          string          `json:"token"`
	Version        uint8           `json:"version"`
	Message        interface{}     `json:"message"`
	AppPermissions uint64          `json:"app_permissions,string"`
	Locale         string          `json:"locale"`
	GuildLocale    string          `json:"guild_locale"`
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
	Messages    map[string]interface{} `json:"messages"`
	Attachments map[string]interface{} `json:"attachments"`
}

type ApplicationCommandInteractionDataOption struct {
	Name    string                                     `json:"name"`
	Type    OptionType                                 `json:"type"`
	Value   interface{}                                `json:"value,omitempty"`
	Options []*ApplicationCommandInteractionDataOption `json:"options,omitempty"`
	Focused bool                                       `json:"focused,omitempty"`
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
	TTS             bool            `json:"tts"`
	Content         string          `json:"content"`
	Components      []interface{}   `json:"components"`
	Embeds          []*Embed        `json:"embeds"`
	AllowedMentions AllowedMentions `json:"allowed_mentions,omitempty"`
	Attachments     []Attachment    `json:"attachments"`
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
