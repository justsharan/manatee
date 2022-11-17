import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { CommandInteraction } from "discord-workers";
import { Env } from "..";
import googleMap from "../utils/googleMap";

export const name = "map";
export const description = "View any location on a map";
export const options: APIApplicationCommandOption[] = [
  {
    name: "location",
    type: ApplicationCommandOptionType.String,
    description: "Location you'd like to see",
    required: true,
  },
  {
    name: "type",
    type: ApplicationCommandOptionType.String,
    description: "Type of map you'd like",
    required: false,
    choices: [
      {
        name: "Roadmap", // @ts-ignore
        value: "roadmap",
      },
      {
        name: "Satellite", // @ts-ignore
        value: "satellite",
      },
      {
        name: "Terrain", // @ts-ignore
        value: "terrain",
      },
      {
        name: "Hybrid", // @ts-ignore
        value: "hybrid",
      },
    ],
  },
];

export function execute(
  int: CommandInteraction,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const func = async () =>
    int.send({
      attachments: [
        {
          name: "map.png",
          file: await googleMap(
            env.googleMapsKey,
            int.getOption<string>("location")!,
            int.getOption<string>("type") ?? "hybrid",
            int.locale
          ),
        },
      ],
    });

  ctx.waitUntil(func());
  return Promise.resolve(int.defer());
}
