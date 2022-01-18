import fetch from "node-fetch";
import { CommandContext, SlashCommand, SlashCreator } from "slash-create";

export default class extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "advice",
      description: "See what piece of useful advice I have just for you.",
    });
  }

  async run(ctx: CommandContext) {
    // Get random advice
    const res = await fetch("http://api.adviceslip.com/advice");
    const { slip } = await res.json();

    // Send advice to user
    return ctx.send({
      content: slip.advice,
      ephemeral: true,
    });
  }
}
