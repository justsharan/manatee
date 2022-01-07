import { execSync } from "child_process";
import {
  CommandContext,
  CommandOptionType,
  SlashCommand,
  SlashCreator,
} from "slash-create";
import { codeBlock } from "../util";

export default class extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "calendar",
      description: "View the calendar for any given month.",
      options: [
        {
          name: "month",
          description: "The month you'd like to view.",
          type: CommandOptionType.STRING,
          choices: [
            { name: "January", value: "1" },
            { name: "February", value: "2" },
            { name: "March", value: "3" },
            { name: "April", value: "4" },
            { name: "May", value: "5" },
            { name: "June", value: "6" },
            { name: "July", value: "7" },
            { name: "August", value: "8" },
            { name: "September", value: "9" },
            { name: "October", value: "10" },
            { name: "November", value: "11" },
            { name: "December", value: "12" },
          ],
        },
        {
          name: "year",
          description: "The year you'd like to view.",
          type: CommandOptionType.INTEGER,
          min_value: 1,
          max_value: 9999,
        },
      ],
    });
  }

  run(ctx: CommandContext) {
    const { month, year } = ctx.options;

    // Compose cal command
    let command = "cal -h ";
    if (year && month) command += `-d ${year}-${month}`;
    else if (year) command += String(year);
    else if (month) command += `-m ${month}`;

    // Execute command and respond with stdout
    const res = execSync(command);
    return ctx.send(codeBlock(String(res)));
  }
}
