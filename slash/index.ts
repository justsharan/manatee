import path from "path/posix";
import { SlashCreator, VercelServer } from "slash-create";

// Initialize Slash creator (to handle interactions)
const creator = new SlashCreator({
  applicationID: process.env.APPLICATION_ID!,
  publicKey: process.env.PUBLIC_KEY,
  token: `Bot ${process.env.DISCORD_TOKEN}`,
});

export const vercel = new VercelServer();

// Log creator errors to console
creator.on("warn", console.warn);
creator.on("error", console.error);

creator
  .withServer(vercel)
  .registerCommandsIn(path.join(__dirname, "commands"))
  .syncCommands({ deleteCommands: true });
