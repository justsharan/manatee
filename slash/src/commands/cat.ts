import fetch from "node-fetch";
import {
  ButtonStyle,
  CommandContext,
  ComponentActionRow,
  ComponentType,
  SlashCommand,
  SlashCreator,
} from "slash-create";

const CAT_API_URL = "https://api.thecatapi.com/v1/images/search";

const CAT_COMPONENTS: ComponentActionRow[] = [
  {
    type: ComponentType.ACTION_ROW,
    components: [
      {
        type: ComponentType.BUTTON,
        style: ButtonStyle.PRIMARY,
        custom_id: "new_cat",
        label: "Next cat!",
        emoji: { name: "🐱" },
      },
    ],
  },
];

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
        components: CAT_COMPONENTS,
      });
    });
  }

  async run(ctx: CommandContext) {
    // Respond with cat image
    return ctx.send({
      content: await getCat(),
      components: CAT_COMPONENTS,
    });
  }
}
