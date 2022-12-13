import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import googleMap from "../utils/googleMap";

export const data = new SlashCommandBuilder()
  .setName("ip")
  .setDescription("View information about any public IP address")
  .addStringOption((option) =>
    option
      .setName("address")
      .setDescription("IPv4 or IPv6 address you want information on")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const ipAddr = interaction.options.getString("address", true);

  const resp = await fetch(
    `http://ip-api.com/json/${encodeURIComponent(ipAddr)}?lang=${
      interaction.locale
    }`
  );
  const body = await resp.json();
  if (body.status !== "success")
    return interaction.reply(
      "Couldn't find any information on that IP address."
    );

  const map = await googleMap(
    `${body.lat},${body.lon}`,
    "hybrid",
    interaction.locale,
    12
  );

  const embed = new EmbedBuilder()
    .setTitle(body.query)
    .setDescription(`${body.city}, ${body.region}\n${body.country}`)
    .addFields(
      { name: "Service Provider", value: body.isp, inline: true },
      {
        name: "Local Time",
        value: new Date().toLocaleString(interaction.locale, {
          dateStyle: "long",
          timeStyle: "short",
        }),
        inline: true,
      }
    )
    .setColor("#2f3136")
    .setImage(`attachment://${map.name}`);

  interaction.editReply({ embeds: [embed], files: [map] });
}
