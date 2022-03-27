import { CommandInteraction } from "discord-workers";
import advice from "./advice";
import cat from "./cat";
import movie from "./movie";
import urban from "./urban";

type Command = (
  int: CommandInteraction,
  wait: (f: any) => void
) => Response | Promise<Response>;

export default {
  advice,
  cat,
  movie,
  urban,
} as Record<string, Command>;
