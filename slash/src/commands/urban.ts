import fetch from "node-fetch";
import {
  CommandContext,
  CommandOptionType,
  InteractionResponseFlags,
  SlashCommand,
  SlashCreator,
} from "slash-create";

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
    const res = await fetch(
      `https://api.urbandictionary.com/v0/define?term=${ctx.options.term}`
    );
    const body: { list: UrbanTerm[] } = await res.json();

    // Check that there are results
    if (!body.list.length) {
      return ctx.send("There's no word by that name.", {
        flags: InteractionResponseFlags.EPHEMERAL,
      });
    }

    const [entry] = body.list;

    // Send info about the first word
    return ctx.send({
      embeds: [
        {
          title: entry.word,
          url: entry.permalink,
          author: {
            name: entry.author,
          },
          description: entry.definition,
          footer: {
            text: `👍 ${entry.thumbs_up} 👎 ${entry.thumbs_down}`,
          },
          timestamp: entry.written_on,
        },
      ],
    });
  }
}
