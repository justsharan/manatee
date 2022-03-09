import {
  ButtonStyle,
  CommandContext,
  SlashCommand,
  SlashCreator,
} from "slash-create";
import { ActionRow, Button } from "../utils/ComponentBuilder";

const CAT_API_URL = "https://api.thecatapi.com/v1/images/search";

const CAT_COMPONENTS = new ActionRow(
  new Button()
    .style(ButtonStyle.PRIMARY)
    .customID("new_cat")
    .label("Next cat!")
    .emoji("🐱")
).toJSON();

// Get a new cat image
async function getCat(): Promise<string> {
  const res = await fetch(CAT_API_URL);
  const [data] = await res.json();
  return data.url;
}

export default class extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "cat",
      description: "View clips of cats... what else?",
    });

    creator.registerGlobalComponent("new_cat", async (interact) => {
      // Respond with cat image
      return interact.editParent({
        content: await getCat(),
        components: [CAT_COMPONENTS],
      });
    });
  }

  async run(ctx: CommandContext) {
    // Respond with cat image
    return ctx.send({
      content: await getCat(),
      components: [CAT_COMPONENTS],
    });
  }
}
