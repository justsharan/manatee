export default async function googleMap(
  apiKey: string,
  center: string,
  maptype = "hybrid",
  language = "en-US",
  zoom?: number
): Promise<Blob> {
  const mapsURL = new URL("https://maps.googleapis.com/maps/api/staticmap");
  mapsURL.searchParams.set("key", apiKey);
  mapsURL.searchParams.set("center", center);
  mapsURL.searchParams.set("maptype", maptype);
  mapsURL.searchParams.set("language", language);
  mapsURL.searchParams.set("size", "600x500");
  mapsURL.searchParams.set("scale", "2");
  if (zoom) mapsURL.searchParams.set("zoom", String(zoom));

  const resp = await fetch(mapsURL.href);
  return resp.blob();
}
