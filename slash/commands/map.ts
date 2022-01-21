import fetch from "node-fetch";
import {
  CommandContext,
  CommandOptionType,
  SlashCommand,
  SlashCreator,
} from "slash-create";

export default class extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "map",
      description: "View any location in the world on a map.",
      deferEphemeral: false,
      options: [
        {
          name: "location",
          description: "The place you'd like to view",
          type: CommandOptionType.STRING,
          required: true,
        },
        {
          name: "type",
          description: "The type of map you'd like",
          type: CommandOptionType.STRING,
          choices: [
            { name: "Roadmap", value: "roadmap" },
            { name: "Satellite", value: "satellite" },
            { name: "Hybrid", value: "hybrid" },
            { name: "Terrain", value: "terrain" },
          ],
        },
      ],
    });
  }

  async run(ctx: CommandContext) {
    await ctx.defer();

    // Assemble URL to fetch
    const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
    url.searchParams.set("center", encodeURIComponent(ctx.options.location));
    url.searchParams.set("size", "500x375");
    url.searchParams.set("key", process.env.GOOGLE_KEY!);
    if (ctx.options.type) {
      url.searchParams.set("maptype", ctx.options.type);
    }

    // Get image from Google
    const res = await fetch(url);
    const image = await res.buffer();

    // Send image to user
    await ctx.send({
      content: "Here's the map",
      file: {
        name: `map-${Date.now()}.png`,
        file: image,
      },
    });
  }
}
