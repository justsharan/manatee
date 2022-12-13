import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

const MERRIAM_WEBSTER_URL = "https://www.merriam-webster.com/dictionary";
const MERRIAM_WEBSTER_ICON =
  "https://dictionaryapi.com/images/info/branding-guidelines/MWLogo_DarkBG_120x120_2x.png";

export const data = new SlashCommandBuilder()
  .setName("define")
  .setDescription("Get the dictionary entry of any English word")
  .addStringOption((option) =>
    option
      .setName("term")
      .setDescription("Term to get the entry for")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const term = interaction.options.getString("term", true);
  const resp = await fetch(
    `https://dictionaryapi.com/api/v3/references/collegiate/json/${term}?key=${process.env.MERRIAM_WEBSTER_KEY}`
  );
  const body = await resp.json();
  if (body.length === 0)
    return interaction.reply({
      content: `No dictionary entry found for **${term}**.`,
      ephemeral: true,
    });

  if (typeof body[0] === "string") {
    return interaction.reply({
      content: `No dictionary entry found for **${term}**.\nDid you mean one of these other words? If so, run </define:${
        interaction.commandId
      }> again.\n\n${body.slice(0, 5).join("\n")}`,
      ephemeral: true,
    });
  }

  const embed = new EmbedBuilder()
    .setTitle(formatMerriamStr(body[0].hwi.hw.toUpperCase()))
    .setDescription(
      body[0].shortdef.map((e: string) => `: ${formatMerriamStr(e)}`).join("\n")
    )
    .setFooter({
      iconURL: MERRIAM_WEBSTER_ICON,
      text: "Merriam-Webster Dictionary",
    })
    .setURL(`${MERRIAM_WEBSTER_URL}/${body[0].meta.id}`)
    .setColor("#004990");

  if (body[0].et)
    embed.addFields({
      name: "Etymology",
      value: body[0].et
        .map((e: [string, string]) => formatMerriamStr(e[1]))
        .join("\n"),
    });

  if (body[0].date)
    embed.addFields({
      name: "First Known Use",
      value: body[0].date.replace(/{(.*)}/, ""),
    });

  if (body[0].art) {
    embed.addFields({
      name: "Artwork",
      value: formatMerriamStr(body[0].art.capt),
    });
    embed.setImage(
      `https://www.merriam-webster.com/assets/mw/static/art/dict/${body[0].art.artid}.gif`
    );
  }

  interaction.reply({ embeds: [embed] });
}

const formatMerriamStr = (str: string): string =>
  str
    .replace(/\*/g, " • ")
    .replace(/{\/?it}/g, "*")
    .replace(/{\/w?it?}/g, "*")
    .replace(
      /{sc}(\w*){\/sc}/g,
      (e) =>
        `[**${e.toUpperCase()}**](${MERRIAM_WEBSTER_URL}/${encodeURIComponent(
          e
        )})`
    )
    .replace(/{a_link\|(.*)}/g, (_, a) => `[${a}](${MERRIAM_WEBSTER_URL}/${a})`)
    .replace(
      /{d_link\|(.*)\|(.*)}/g,
      (_, a, b) => `[${a}](${MERRIAM_WEBSTER_URL}/${b || a})`
    )
    .replace(
      /{i_link\|(.*)\|(.*)}/g,
      (_, a, b) => `[*${a}*](${MERRIAM_WEBSTER_URL}/${b || a})`
    )
    .replace(
      /{et_link\|(\w*-)\|(\w*-)}/g,
      (_, a, b) => `[${a.toUpperCase()}](${MERRIAM_WEBSTER_URL}/${b || a})`
    )
    .replace(
      /{ma}{mat\|(\w*):?\d?\|(\w*):?\d?}{\/ma}/g,
      (_, a, b) =>
        `more at [${a.toUpperCase()}](${MERRIAM_WEBSTER_URL}/${b || a})`
    );
