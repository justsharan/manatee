import { AttachmentBuilder } from "discord.js";

export default async function googleMap(
  center: string,
  maptype = "hybrid",
  language = "en-US",
  zoom?: number
): Promise<AttachmentBuilder> {
  const mapsURL = new URL("https://maps.googleapis.com/maps/api/staticmap");
  mapsURL.searchParams.set("key", process.env.GOOGLE_MAPS_KEY!);
  mapsURL.searchParams.set("center", center);
  mapsURL.searchParams.set("maptype", maptype);
  mapsURL.searchParams.set("language", language);
  mapsURL.searchParams.set("size", "600x500");
  mapsURL.searchParams.set("scale", "2");
  if (zoom) mapsURL.searchParams.set("zoom", String(zoom));

  const resp = await fetch(mapsURL.href);
  return new AttachmentBuilder(Buffer.from(await resp.arrayBuffer()), {
    name: `map-${Date.now()}.png`,
  });
}
