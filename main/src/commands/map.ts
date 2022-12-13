import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import googleMap from "../utils/googleMap";

export const data = new SlashCommandBuilder()
  .setName("map")
  .setDescription("View any location on a map")
  .addStringOption((option) =>
    option
      .setName("location")
      .setDescription("Location you'd like to see")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("Type of map you'd like")
      .setRequired(false)
      .addChoices(
        {
          name: "Roadmap",
          value: "roadmap",
        },
        {
          name: "Satellite",
          value: "satellite",
        },
        {
          name: "Terrain",
          value: "terrain",
        },
        {
          name: "Hybrid",
          value: "hybrid",
        }
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const map = await googleMap(
    interaction.options.getString("location", true),
    interaction.options.getString("type", false) ?? "hybrid",
    interaction.locale
  );

  interaction.reply({ files: [map] });
}
