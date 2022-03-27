import { CommandInteraction } from "discord-workers";
import advice from "./advice";
import cat from "./cat";
import movie from "./movie";

type Command = (
  int: CommandInteraction,
  wait: (f: any) => void
) => Response | Promise<Response>;

export default {
  advice,
  cat,
  movie,
} as Record<string, Command>;
