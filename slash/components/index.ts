import { Interaction } from "discord-workers";
import trivia from "./trivia";

type Command = (
  int: Interaction,
  wait: (f: any) => void
) => void | Response | Promise<Response | void>;

export default [trivia] as Command[];
