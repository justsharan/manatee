import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("xkcd")
  .setDescription("Retrieve an xkcd comic.")
  .addIntegerOption((option) =>
    option
      .setName("id")
      .setDescription("The ID of the comic to retrieve")
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const id = interaction.options.getInteger("id", false);
  const url = id
    ? `https://xkcd.com/${id}/info.0.json`
    : "https://xkcd.com/info.0.json";

  const res = await fetch(url);
  const body = await res.json();

  interaction.reply(body.img);
}
