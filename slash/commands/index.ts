import { CommandInteraction } from "discord-workers";
import advice from "./advice";
import cat from "./cat";
import movie from "./movie";
import urban from "./urban";
import weather from "./weather";

type Command = (
  int: CommandInteraction,
  wait: (f: any) => void
) => Response | Promise<Response>;

export default {
  advice,
  cat,
  movie,
  urban,
  weather,
} as Record<string, Command>;
