import { CommandInteraction } from "discord-workers";

export const name = "cat";
export const description = "View cute pictures of cats";

export async function execute(int: CommandInteraction): Promise<Response> {
  const resp = await fetch("https://api.thecatapi.com/v1/images/search");
  const body: { id: string; url: string }[] = await resp.json();
  return int.send(body[0].url);
}
