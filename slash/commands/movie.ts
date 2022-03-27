import { CommandInteraction } from "discord-workers";

export default async (int: CommandInteraction): Promise<Response> => {
  const request = new URL("https://api.themoviedb.org/3/search/movie");
  request.searchParams.set("api_key", TMDB_KEY);
  request.searchParams.set("query", int.options.title);
  if (int.options.year) {
    request.searchParams.set("year", String(int.options.year));
  }

  // Find movie
  const res = await fetch(request.href);
  const body = (await res.json()) as any;

  // Send message if no movie was found
  if (!body.results.length) {
    return int.send({
      content: "There's no movie by that name (in that year, if specified).",
      flags: 64,
    });
  }

  // Get full details of movie
  const res2 = await fetch(
    `https://api.themoviedb.org/3/movie/${body.results[0].id}?api_key=${TMDB_KEY}`
  );
  const movie = (await res2.json()) as any;

  return int.send({
    embeds: [
      {
        title: `${movie.title} (${movie.release_date.slice(0, 4)})`,
        url: `https://www.imdb.com/title/${movie.imdb_id}`,
        description: movie.overview ?? "",
        fields: [
          {
            name: "Genres",
            value: movie.genres.map((g: any): string => g.name).join(", "),
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
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,
            url: `https://www.themoviedb.org/movie/${movie.id}-${movie.title
              .toLowerCase()
              .replace(/\s/g, "-")}/watch`,
            label: "Watch Now",
          },
        ],
      },
    ],
  });
};
