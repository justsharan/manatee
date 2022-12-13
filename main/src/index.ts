import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { readdirSync } from "fs";

export const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => any;
};

export const commands = new Collection<string, Command>();

readdirSync("./dist/events/").forEach(async (file) => {
  const contents = await import(`./events/${file}`);
  client.on(file.slice(0, -3), contents.default);
  console.log(`Loaded ${file.slice(0, -3)} event!`);
});

readdirSync("./dist/commands/").map(async (file) => {
  const contents = await import(`./commands/${file}`);
  commands.set(file.slice(0, -3), {
    data: contents.data,
    execute: contents.execute,
  });
});

client.login(process.env.DISCORD_TOKEN);
