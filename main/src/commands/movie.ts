import { oneLine } from "common-tags";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import slugify from "../utils/slugify";

const TMDB_URL = "https://api.themoviedb.org/3";

export const data = new SlashCommandBuilder()
  .setName("movie")
  .setDescription("Search for info on your favorite movie")
  .addStringOption((option) =>
    option
      .setName("title")
      .setDescription("The title of the movie")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("year")
      .setDescription("Year that the movie was released in")
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const url = new URL(`${TMDB_URL}/search/movie`);
  url.searchParams.set("api_key", process.env.TMDB_KEY!);
  // url.searchParams.set("language", interaction.locale);
  const title = interaction.options.getString("title", true);
  url.searchParams.set("query", title);
  const year = interaction.options.getInteger("year", false);
  if (year) url.searchParams.set("year", String(year));

  // prettier-ignore
  const resp = await fetch(url.href);
  const body = await resp.json();
  if (body.results.length === 0)
    return interaction.reply({
      content: oneLine`
        No movie found by the name **${title}**.
        If you meant to search for another movie, run </movie:${interaction.commandId}> again.
      `,
      ephemeral: true,
    });

  const movie = body.results[0];
  const embed = new EmbedBuilder()
    .setURL(`https://letterboxd.com/film/${slugify(movie.title)}`)
    .setTitle(`${movie.title} (${movie.release_date.slice(0, 4)})`)
    .setDescription(movie.overview)
    .setImage(`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`)
    .setThumbnail(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    .setColor("#2f3136");

  interaction.reply({ embeds: [embed] });
}
