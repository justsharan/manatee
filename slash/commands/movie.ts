import fetch from "node-fetch";
import {
  ButtonStyle,
  CommandContext,
  CommandOptionType,
  ComponentType,
  InteractionResponseFlags,
  SlashCommand,
  SlashCreator,
} from "slash-create";
import { EmbedBuilder } from "../utils/EmbedBuilder";

interface TMDBMovie {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: object | null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: { name: string }[];
  release_date: string;
  revenue: number;
  runtime: number;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const TMDB_API_URL = "https://api.themoviedb.org/3/search/movie";
const TMDB_API_MOVIE_URL = "https://api.themoviedb.org/3/movie";

export default class extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "movie",
      description: "Search for your favorite movie online.",
      options: [
        {
          name: "title",
          description: "The title of the movie you're looking for.",
          type: CommandOptionType.STRING,
          required: true,
        },
        {
          name: "year",
          description: "The year the movie was released.",
          type: CommandOptionType.INTEGER,
        },
      ],
    });
  }

  async run(ctx: CommandContext) {
    // Create querystring params for request
    const params = new URLSearchParams({
      api_key: process.env.TMDB_KEY ?? "",
      query: ctx.options.title,
    });
    if (ctx.options.year) params.set("year", String(ctx.options.year));

    // Find movie
    const res = await fetch(`${TMDB_API_URL}?${params.toString()}`);
    const body: { results: { id: number }[] } = await res.json();

    // Send message if no movie was found.
    if (!body.results.length) {
      return ctx.send({
        content: "There's no movie by that name (in that year, if specified).",
        flags: InteractionResponseFlags.EPHEMERAL,
      });
    }

    console.log(`Retrieving movie ${body.results[0].id} for ${ctx.user.id}`);
    await ctx.defer();

    // Get full details of movie
    const movieRes = await fetch(
      `${TMDB_API_MOVIE_URL}/${body.results[0].id}?api_key=${process.env.TMDB_KEY}`
    );
    const movie: TMDBMovie = await movieRes.json();
    console.log(`Retrieved movie ${movie.id}!`);

    // Send info about movie
    return ctx.editOriginal({
      embeds: [
        new EmbedBuilder()
          .title(`${movie.title} (${movie.release_date.slice(0, 4)})`)
          .URL(`https://www.imdb.com/title/${movie.imdb_id}`)
          .description(movie.overview ?? "")
          .field("Genres", movie.genres.map((g) => g.name).join(", "), true)
          .field("Length", `${movie.runtime} min`, true)
          .field(
            "Box Office",
            movie.revenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }),
            true
          )
          .image(`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`)
          .thumbnail(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)
          .toJSON(),
      ],
      components: [
        {
          type: ComponentType.ACTION_ROW,
          components: [
            {
              type: ComponentType.BUTTON,
              style: ButtonStyle.LINK,
              url: `https://www.themoviedb.org/movie/${movie.id}-${movie.title
                .toLowerCase()
                .replace(/\s/g, "-")}/watch`,
              label: "Watch now",
            },
          ],
        },
      ],
    });
  }
}
