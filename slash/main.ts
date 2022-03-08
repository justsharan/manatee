import commands from "./commands";
import { SlashCreator, CFWorkerServer } from "./shim/";

export const creator = new SlashCreator({
  applicationID: DISCORD_APP_ID,
  publicKey: DISCORD_PUBLIC_KEY,
  token: DISCORD_BOT_TOKEN,
});

creator.withServer(new CFWorkerServer()).registerCommands(commands);
