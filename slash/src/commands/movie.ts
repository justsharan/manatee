import fetch from "node-fetch";
import {
  CommandContext,
  CommandOptionType,
  InteractionResponseFlags,
  SlashCommand,
  SlashCreator,
} from "slash-create";

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
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?${params.toString()}`
    );
    const body: { results: { id: number }[] } = await res.json();

    // Send message if no movie was found.
    if (!body.results.length) {
      return ctx.send(
        "There's no movie by that name (in that year, if specified).",
        {
          flags: InteractionResponseFlags.EPHEMERAL,
        }
      );
    }

    await ctx.defer();

    const movieRes = await fetch(
      `https://api.themoviedb.org/3/movie/${body.results[0].id}?api_key=${process.env.TMDB_KEY}`
    );
    const movie: TMDBMovie = await movieRes.json();

    return ctx.editOriginal({
      embeds: [
        {
          title: `${movie.title} (${movie.release_date.slice(0, 4)})`,
          url: `https://www.imdb.com/title/${movie.imdb_id}`,
          description: movie.overview ?? "",
          fields: [
            {
              name: "Genres",
              value: movie.genres.map((g) => g.name).join(", "),
              inline: true,
            },
            {
              name: "Length",
              value: `${movie.runtime} min`,
              inline: true,
            },
            {
              name: "Box Office",
              value: movie.revenue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }),
              inline: true,
            },
          ],
          image: {
            url: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
          },
          thumbnail: {
            url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          },
        },
      ],
    });
  }
}
