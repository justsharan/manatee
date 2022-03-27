import { CommandInteraction, Embed } from "discord-workers";

export default async (
  int: CommandInteraction<{ title: string; year: number }>
): Promise<Response> => {
  const request = new URL("https://api.themoviedb.org/3/search/movie");
  request.searchParams.set("api_key", TMDB_KEY);
  request.searchParams.set("query", int.options.title!);
  if (int.options.year) {
    request.searchParams.set("year", String(int.options.year));
  }

  // Find movie
  const res = await fetch(request.href);
  const body: any = await res.json();

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
  const movie: any = await res2.json();

  return int.send({
    embeds: [
      new Embed()
        .title(`${movie.title} (${movie.release_date.slice(0, 4)})`)
        .URL(`https://www.imdb.com/title/${movie.imdb_id}`)
        .description(movie.overview ?? "")
        .field(
          "Genres",
          movie.genres.map((g: any): string => g.name).join(", "),
          true
        )
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
