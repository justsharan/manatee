import path from "path";
import { SlashCreator, VercelServer } from "slash-create";
import { executeWebhook, inlineCodeBlock } from "../utils/funcs";

// Initialize Slash creator (to handle interactions)
export const creator = new SlashCreator({
  applicationID: process.env.APPLICATION_ID!,
  publicKey: process.env.PUBLIC_KEY,
  token: `Bot ${process.env.DISCORD_TOKEN}`,
});

// Log creator errors to console
creator.on("warn", console.warn);
creator.on("error", console.error);
creator.on("commandError", (_, err) => console.error(err));
creator.on("commandRun", (cmd, _, ctx) =>
  executeWebhook(process.env.LOG_HOOK!, {
    content: `
**Action**: ${inlineCodeBlock(
      ctx.user.username + "#" + ctx.user.discriminator
    )} (${inlineCodeBlock(ctx.user.id)}) executed the ${inlineCodeBlock(
      cmd.commandName
    )} command.
**Options**: ${Object.entries(ctx.options)
      .map(([k, v]) => `${k}:${inlineCodeBlock(v)}`)
      .join(", ")}
**Time**: <t:${Math.round(Date.now() / 1000)}>
    `,
  })
);

creator
  .withServer(new VercelServer())
  .registerCommandsIn(path.join(__dirname, "..", "commands"))
  .syncCommands({ deleteCommands: true });

export default (creator.server as VercelServer).vercelEndpoint;
