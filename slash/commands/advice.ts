import { CommandInteraction } from "discord-workers";

export default async (int: CommandInteraction): Promise<Response> => {
  const res = await fetch("https://api.adviceslip.com/advice");
  const body = (await res.json()) as any;
  return int.respond(4, { content: body.slip.advice });
};
