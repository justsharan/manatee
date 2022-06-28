import { Guild } from "types/discord";

export function truncateName(name: string): string {
  return name.length > 25 ? name.slice(0, 20) + "..." : name;
}

export function iconURL({ id, icon }: Guild): string {
  return `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=256`;
}
