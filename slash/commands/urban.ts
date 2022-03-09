import {
  CommandContext,
  CommandOptionType,
  InteractionResponseFlags,
  SlashCommand,
  SlashCreator,
} from "slash-create";
import { EmbedBuilder } from "../utils/EmbedBuilder";

interface UrbanTerm {
  definition: string;
  permalink: string;
  thumbs_up: number;
  author: string;
  word: string;
  defid: number;
  written_on: string;
  example: string;
  thumbs_down: number;
}

const URBAN_URL = "https://www.urbandictionary.com/define.php";
const URBAN_API_URL = "https://api.urbandictionary.com/v0/define";

function formatDefinition(def: string): string {
  return def.replace(/\[(.*?)\]/g, (term) => {
    const sliced = term.slice(1, -1);
    return `[${sliced}](${URBAN_URL}?term=${encodeURIComponent(sliced)})`;
  });
}

export default class extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "urban",
      description: "Search for a word in Urban Dictionary.",
      options: [
        {
          name: "term",
          description: "The term you'd like to define.",
          type: CommandOptionType.STRING,
          required: true,
        },
      ],
    });
  }

  async run(ctx: CommandContext) {
    // Find term on urban dictionary
    const res = await fetch(`${URBAN_API_URL}?term=${ctx.options.term}`);
    const body: { list: UrbanTerm[] } = await res.json();

    // Check that there are results
    if (!body.list.length) {
      return ctx.send({
        content: "There's no word by that name.",
        flags: InteractionResponseFlags.EPHEMERAL,
      });
    }

    const [entry] = body.list;

    // Send info about the first word
    return ctx.send(
      new EmbedBuilder()
        .title(entry.word)
        .URL(entry.permalink)
        .author(entry.author)
        .description(formatDefinition(entry.definition))
        .footer(`👍 ${entry.thumbs_up} 👎 ${entry.thumbs_down}`)
        .timestamp(entry.written_on)
        .toMessage()
    );
  }
}
