import path from "path";
import { SlashCreator, VercelServer } from "slash-create";

// Initialize Slash creator (to handle interactions)
export const creator = new SlashCreator({
  applicationID: process.env.APPLICATION_ID!,
  publicKey: process.env.PUBLIC_KEY,
  token: `Bot ${process.env.DISCORD_TOKEN}`,
});

// Log creator errors to console
creator.on("warn", console.warn);
creator.on("error", console.error);

creator
  .withServer(new VercelServer())
  .registerCommandsIn(path.join(__dirname, "..", "commands"))
  .syncCommands({ deleteCommands: true });

export default (creator.server as VercelServer).vercelEndpoint;
