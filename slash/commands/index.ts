import { CommandInteraction } from "discord-workers";
import advice from "./advice";
import cat from "./cat";
import flight from "./flight";
import map from "./map";
import movie from "./movie";
import trivia from "./trivia";
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
  map,
  movie,
  trivia,
  urban,
  weather,
} as Record<string, Command>;
