package types

type User struct {
	ID            Snowflake   `json:"id"`
	Username      string      `json:"username"`
	Discriminator uint        `json:"discriminator,string"`
	Avatar        string      `json:"avatar"`
	Bot           bool        `json:"bot"`
	System        bool        `json:"system"`
	MFAEnabled    bool        `json:"mfa_enabled"`
	Banner        string      `json:"banner"`
	AccentColor   uint        `json:"accent_color"`
	Locale        string      `json:"locale"`
	Flags         UserFlags   `json:"flags"`
	PremiumType   PremiumType `json:"premium_type"`
	PublicFlags   UserFlags   `json:"public_flags"`
}

type UserFlags uint

const (
	UserFlagDiscordEmployee           UserFlags = 1 << 0
	UserFlagDiscordPartner            UserFlags = 1 << 1
	UserFlagHypeSquadEvents           UserFlags = 1 << 2
	UserFlagBugHunterLevel1           UserFlags = 1 << 3
	UserFlagHouseBravery              UserFlags = 1 << 6
	UserFlagHouseBrilliance           UserFlags = 1 << 7
	UserFlagHouseBalance              UserFlags = 1 << 8
	UserFlagEarlySupporter            UserFlags = 1 << 9
	UserFlagTeamUser                  UserFlags = 1 << 10
	UserFlagSystem                    UserFlags = 1 << 12
	UserFlagBugHunterLevel2           UserFlags = 1 << 14
	UserFlagVerifiedBot               UserFlags = 1 << 16
	UserFlagVerifiedBotDeveloper      UserFlags = 1 << 17
	UserFlagDiscordCertifiedModerator UserFlags = 1 << 18
)

type PremiumType uint8

const (
	None         PremiumType = 0
	NitroClassic PremiumType = 1
	Nitro        PremiumType = 2
)

type AllowedMentions struct {
	Parse       []string `json:"parse"`
	Roles       []string `json:"roles,omitempty"`
	Users       []string `json:"users,omitempty"`
	RepliedUser bool     `json:"replied_user,omitempty"`
}

type Attachment struct {
	Filename    string `json:"filename"`
	Description string `json:"description"`
}

type MessageFlags uint8

const (
	FlagSuppressEmbeds MessageFlags = 1 << 2
	FlagEphemeral      MessageFlags = 1 << 6
)

type Embed struct {
	Title       string       `json:"title"`
	Description string       `json:"description"`
	URL         string       `json:"url"`
	Timestamp   string       `json:"timestamp"`
	Color       uint         `json:"color"`
	Footer      EmbedFooter  `json:"footr"`
	Image       EmbedImage   `json:"image"`
	Thumbnail   EmbedImage   `json:"thumbnail"`
	Author      EmbedAuthor  `json:"author"`
	Fields      []EmbedField `json:"fields"`
}

type EmbedFooter struct {
	Text    string `json:"text"`
	IconURL string `json:"icon_url,omitempty"`
}

type EmbedImage struct {
	URL string `json:"url"`
}

type EmbedAuthor struct {
	Name    string `json:"name"`
	URL     string `json:"url,omitempty"`
	IconURL string `json:"icon_url,omitempty"`
}

type EmbedField struct {
	Name   string `json:"name"`
	Value  string `json:"value"`
	Inline bool   `json:"inline,omitempty"`
}
