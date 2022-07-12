import { CommandInteraction } from "discord-workers";

export default async (int: CommandInteraction): Promise<Response> => {
  const res = await fetch("https://api.adviceslip.com/advice");
  const body: any = await res.json();
  return int.send({
    content: body.slip.advice,
    flags: 64,
  });
};
