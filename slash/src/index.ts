import { Client, Intents } from "discord.js";
import path from "path/posix";
import { GatewayServer, SlashCreator } from "slash-create";

// Initialize Discord bot
const client = new Client({
  intents: Intents.FLAGS.GUILDS,
});

// Initialize Slash creator (to handle interactions)
const creator = new SlashCreator({
  applicationID: process.env.APPLICATION_ID!,
  token: `Bot ${process.env.DISCORD_TOKEN}`,
});

creator
  .withServer(new GatewayServer((h) => client.ws.on("INTERACTION_CREATE", h)))
  .registerCommandsIn(path.join(__dirname, "commands"))
  .syncCommands();

// Log creator errors to console
creator.on("warn", console.warn);
creator.on("error", console.error);

creator.on("synced", () => console.log("Synced all commands!"));
client.on("ready", () => console.log("Discord client is ready!"));

client.login(process.env.DISCORD_TOKEN);
