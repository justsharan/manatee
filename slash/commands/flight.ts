import cheerio from "cheerio";
import { CommandInteraction, Embed } from "discord-workers";

const FLIGHT_URL = "https://www.flightview.com/flight-tracker";

export default async (int: CommandInteraction): Promise<Response> => {
  const { code } = int.options;
  const res = await fetch(`${FLIGHT_URL}/${code.slice(0, 2)}/${code.slice(2)}`);

  if (res.url.includes("ftError")) {
    return int.send({
      content: "No flight by that code is flying today.",
      flags: 64,
    });
  }

  const $ = cheerio.load(await res.text());

  const flightName = $("span#flight-header-label").text();
  const airlineLogo = $("span#flight-header-logo img").attr("src");
  const flightStatus = $("div.flight-status").text();

  const originCode = $(
    "div.airport-header-left div.airport-header-code"
  ).text();
  const originName = $(
    "div.airport-header-left div.airport-header-name"
  ).text();

  const destCode = $("div.airport-header-rite div.airport-header-code").text();
  const destName = $("div.airport-header-rite div.airport-header-name").text();

  const routeMap = $("p.map img").attr("src");

  const startTime = $(
    "#ffDepartureInfo > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)"
  ).text();
  const endTime = $(
    "#ffArrivalInfo > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)"
  ).text();

  return int.send(
    new Embed()
      .title(`Flight from ${originCode} to ${destCode} • ${flightStatus}`)
      .description(
        `This is an ${flightName
          .split("(")[0]
          .trim()} flight from ${originName} to ${destName}.`
      )
      .author(flightName, `https:${airlineLogo}`)
      .image(`https://www.flightview.com${routeMap}`)
      .field("🛫 Departure", startTime, true)
      .field("🛬 Arrival", endTime, true)
      .toMessage()
  );
};
