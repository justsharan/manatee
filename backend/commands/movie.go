package commands

import (
	"backend/types"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
)

var tmdb_key = os.Getenv("TMDB_KEY")

type SearchResult struct {
	Page    int `json:"page"`
	Results []struct {
		PosterPath       string  `json:"poster_path"`
		Adult            bool    `json:"adult"`
		Overview         string  `json:"overview"`
		ReleaseDate      string  `json:"release_date"`
		GenreIds         []int   `json:"genre_ids"`
		ID               int     `json:"id"`
		OriginalTitle    string  `json:"original_title"`
		OriginalLanguage string  `json:"original_language"`
		Title            string  `json:"title"`
		BackdropPath     string  `json:"backdrop_path"`
		Popularity       float64 `json:"popularity"`
		VoteCount        int     `json:"vote_count"`
		Video            bool    `json:"video"`
		VoteAverage      float64 `json:"vote_average"`
	} `json:"results"`
	TotalResults int `json:"total_results"`
	TotalPages   int `json:"total_pages"`
}

type Movie struct {
	Adult               bool        `json:"adult"`
	BackdropPath        string      `json:"backdrop_path"`
	BelongsToCollection interface{} `json:"belongs_to_collection"`
	Budget              int         `json:"budget"`
	Genres              []struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	} `json:"genres"`
	Homepage            string  `json:"homepage"`
	ID                  int     `json:"id"`
	ImdbID              string  `json:"imdb_id"`
	OriginalLanguage    string  `json:"original_language"`
	OriginalTitle       string  `json:"original_title"`
	Overview            string  `json:"overview"`
	Popularity          float64 `json:"popularity"`
	PosterPath          string  `json:"poster_path,omitempty"`
	ProductionCompanies []struct {
		ID            int    `json:"id"`
		LogoPath      string `json:"logo_path"`
		Name          string `json:"name"`
		OriginCountry string `json:"origin_country"`
	} `json:"production_companies"`
	ProductionCountries []struct {
		Iso31661 string `json:"iso_3166_1"`
		Name     string `json:"name"`
	} `json:"production_countries"`
	ReleaseDate     string `json:"release_date"`
	Revenue         int    `json:"revenue"`
	Runtime         int    `json:"runtime"`
	SpokenLanguages []struct {
		Iso6391 string `json:"iso_639_1"`
		Name    string `json:"name"`
	} `json:"spoken_languages"`
	Status      string  `json:"status"`
	Tagline     string  `json:"tagline"`
	Title       string  `json:"title"`
	Video       bool    `json:"video"`
	VoteAverage float64 `json:"vote_average"`
	VoteCount   int     `json:"vote_count"`
}

func movie(i *types.Interaction, data *types.ApplicationCommandInteractionData) {
	title, _ := data.GetOption("title")
	year, noYear := data.GetOption("year")

	// Format the URL
	query := url.QueryEscape(title.StringValue())
	var searchURL string
	if noYear != nil {
		searchURL = fmt.Sprintf("https://api.themoviedb.org/3/search/movie?api_key=%s&query=%s", tmdb_key, query)
	} else {
		searchURL = fmt.Sprintf("https://api.themoviedb.org/3/search/movie?api_key=%s&query=%s&year=%f", tmdb_key, query, year.IntValue())
	}

	// Search for movie
	searchResp, err := http.Get(searchURL)
	if err != nil {
		fmt.Println(err)
		i.Error("No movie found by that name")
		return
	}

	// Get search data
	defer searchResp.Body.Close()
	var searchData SearchResult
	if err = json.NewDecoder(searchResp.Body).Decode(&searchData); err != nil {
		fmt.Println(err)
		i.Error("Error searching for that movie.")
		return
	}

	// Show error if no movie is found
	if searchData.TotalResults == 0 {
		fmt.Println(searchURL)
		i.Error("I didn't find any movie by that name.")
		return
	}

	// Retrieve movie
	movieResp, err := http.Get(fmt.Sprintf("https://api.themoviedb.org/3/movie/%d?api_key=%s", searchData.Results[0].ID, tmdb_key))
	if err != nil {
		fmt.Println(err)
		i.Error("Error finding details about that movie.")
		return
	}

	// Get movie data
	defer movieResp.Body.Close()
	var movie Movie
	if err = json.NewDecoder(movieResp.Body).Decode(&movie); err != nil {
		fmt.Println(err)
		i.Error("Error finding details about that movie.")
		return
	}

	// Respond with movie data
	i.Respond(types.InteractionResponse{
		Type: types.ResponseChannelMessageWithSource,
		Data: types.ResponseData{
			Embeds: []*types.Embed{{
				Title:       fmt.Sprintf("%s (%s)", movie.Title, movie.ReleaseDate[:4]),
				URL:         "https://letterboxd.com/film/" + KebabCaseTitle(movie.OriginalTitle),
				Description: movie.Overview,
				Fields: []types.EmbedField{
					{
						Name: "Genres",
						Value: func() string {
							res := ""
							for _, genre := range movie.Genres {
								res += genre.Name + ", "
							}
							return res[:len(res)-2]
						}(),
						Inline: true,
					},
					{
						Name:   "Length",
						Value:  fmt.Sprintf("%d min", movie.Runtime),
						Inline: true,
					},
				},
				Image: types.EmbedImage{
					URL: "https://image.tmdb.org/t/p/w500" + movie.BackdropPath,
				},
				Thumbnail: types.EmbedImage{
					URL: "https://image.tmdb.org/t/p/w500" + movie.PosterPath,
				},
			}},
			Components: []interface{}{
				types.ActionRow{
					Type: types.ComponentActionRow,
					Components: []interface{}{
						types.Button{
							Type:  types.ComponentButton,
							Style: types.ButtonLink,
							URL:   fmt.Sprintf("https://www.themoviedb.org/movie/%d-%s/watch", movie.ID, KebabCaseTitle(movie.Title)),
							Label: "Watch Now",
						},
					},
				},
			},
		},
	})
}

func KebabCaseTitle(title string) string {
	return strings.ReplaceAll(strings.ToLower(title), " ", "-")
}
