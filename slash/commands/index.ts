import { CommandInteraction } from "discord-workers";
import Advice from "./advice";

type Command = (
  int: CommandInteraction,
  wait: (f: any) => void
) => Response | Promise<Response>;

export default {
  advice: Advice,
} as Record<string, Command>;
