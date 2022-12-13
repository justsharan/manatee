import { Interaction } from "discord.js";
import { commands } from "..";

export default async function (interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  // Execute relevant command
  const command = commands.get(interaction.commandName);
  if (command) {
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
    }
  }
}
