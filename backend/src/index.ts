import { createHandler } from "discord-workers";
import commands from "./commands/index";

export interface Env {
  applicationID: string;
  googleMapsKey: string;
  publicKey: string;
}

export default {
  fetch: createHandler(commands),
};
