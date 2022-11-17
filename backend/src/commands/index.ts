import { Command } from "discord-workers";
import * as advice from "./advice";
import * as cat from "./cat";
import * as ip from "./ip";
import * as map from "./map";

export default [advice, cat, ip, map] as Command[];
