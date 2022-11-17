import { CommandInteraction } from "discord-workers";

export const name = "advice";
export const description =
  "See what piece of useful advice I have just for you";

export async function execute(int: CommandInteraction): Promise<Response> {
  const resp = await fetch("https://api.adviceslip.com/advice");
  const body: any = await resp.json();
  return int.send(body.slip.advice);
}
