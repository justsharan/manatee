import { CommandInteraction } from "discord-workers";

export default async (
  int: CommandInteraction<{ location: string; type?: string; scale?: string }>
): Promise<Response> => {
  const fetchURL = new URL("https://www.mapquestapi.com/staticmap/v5/map");
  fetchURL.searchParams.set("key", MAPQUEST_KEY);
  fetchURL.searchParams.set("size", "@2x");
  fetchURL.searchParams.set(
    "center",
    encodeURIComponent(int.options.location!)
  );
  fetchURL.searchParams.set("type", int.options.type ?? "dark");
  if (int.options.scale) fetchURL.searchParams.set("scalebar", "true");

  const res = await fetch(fetchURL.href);
  const body = await res.blob();

  return int.respond(4, {}, [new File([body], `map-${Date.now()}.jpeg`)]);
};
