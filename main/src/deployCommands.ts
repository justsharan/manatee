import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { readdirSync } from "fs";

(async () => {
  const commands = [];
  for (const file of readdirSync("./dist/commands/")) {
    const contents = await import(`./commands/${file}`);
    commands.push(contents.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${commands.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
