package types

type ComponentType uint8

const (
	ComponentActionRow  ComponentType = 1
	ComponentButton     ComponentType = 2
	ComponentSelectMenu ComponentType = 3
	ComponentTextInput  ComponentType = 4
)

type ActionRow struct {
	Type       ComponentType `json:"type"`
	Components []interface{} `json:"components"`
}

type Button struct {
	Label    string         `json:"label"`
	Style    ButtonStyle    `json:"style"`
	Disabled bool           `json:"disabled"`
	Emoji    ComponentEmoji `json:"emoji"`
	URL      string         `json:"url,omitempty"`
	CustomID string         `json:"custom_id,omitempty"`
}

type ButtonStyle uint8

const (
	ButtonPrimary   ButtonStyle = 1
	ButtonSecondary ButtonStyle = 2
	ButtonSuccess   ButtonStyle = 3
	ButtonDanger    ButtonStyle = 4
	ButtonLink      ButtonStyle = 5
)

type ComponentEmoji struct {
	Name     string `json:"name,omitempty"`
	ID       string `json:"id,omitempty"`
	Animated bool   `json:"animated,omitempty"`
}

type SelectMenu struct {
	CustomID    string             `json:"custom_id,omitempty"`
	Placeholder string             `json:"placeholder"`
	MinValues   int                `json:"min_values,omitempty"`
	MaxValues   int                `json:"max_values,omitempty"`
	Options     []SelectMenuOption `json:"options"`
	Disabled    bool               `json:"disabled"`
}

type SelectMenuOption struct {
	Label       string         `json:"label,omitempty"`
	Value       string         `json:"value"`
	Description string         `json:"description"`
	Emoji       ComponentEmoji `json:"emoji"`
	Default     bool           `json:"default"`
}

type TextInput struct {
	CustomID    string         `json:"custom_id"`
	Label       string         `json:"label"`
	Style       TextInputStyle `json:"style"`
	Placeholder string         `json:"placeholder,omitempty"`
	Value       string         `json:"value,omitempty"`
	Required    bool           `json:"required"`
	MinLength   int            `json:"min_length,omitempty"`
	MaxLength   int            `json:"max_length,omitempty"`
}

type TextInputStyle uint8

const (
	TextInputShort     TextInputStyle = 1
	TextInputParagraph TextInputStyle = 2
)
