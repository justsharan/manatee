import { CommandInteraction } from "discord-workers";

export default async (int: CommandInteraction): Promise<Response> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const body: any = await res.json();
  return int.send({ content: body[0].url });
};
