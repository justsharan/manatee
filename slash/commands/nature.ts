import fetch from "node-fetch";
import { CommandContext, SlashCommand, SlashCreator } from "slash-create";
import { random } from "../utils/funcs";

const EARTH_URL = "https://imgur.com/r/earthporn/hot.json";

export default class extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "nature",
      description: "View beautiful pictures of nature.",
    });
  }

  async run(ctx: CommandContext) {
    const res = await fetch(EARTH_URL);
    const body = await res.json();
    const post = random(body.data);

    return ctx.send(
      `http://i.imgur.com/${post.hash}${post.ext.replace(/\?.*/, "")}`
    );
  }
}
