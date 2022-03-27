import { CommandInteraction } from "discord-workers";
import advice from "./advice";
import cat from "./cat";
import flight from "./flight";
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
  flight,
  movie,
  urban,
  weather,
} as Record<string, Command>;
