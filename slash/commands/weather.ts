import { CommandInteraction, Embed } from "discord-workers";

const moonPhaseEmoji = (phase: string): string => {
  phase = phase.toLowerCase();
  return (phase.includes("moon") ? phase : `${phase} moon`).replace(/\s/g, "_");
};

export default async (
  int: CommandInteraction<{ location: string; units: string }>
): Promise<Response> => {
  const fetchURL = new URL("https://api.weatherapi.com/v1/forecast.json");
  fetchURL.searchParams.set("key", WEATHER_KEY);
  fetchURL.searchParams.set("days", "1");
  fetchURL.searchParams.set("q", int.options.location!);

  const res = await fetch(fetchURL.href);
  if (!res.ok) {
    return int.send({
      content: "No weather information found for this location.",
      flags: 64,
    });
  }

  const { location, current, forecast } = await res.json();
  const { astro, day } = forecast.forecastday[0];

  if (!int.options.units && location.country !== "United States of America") {
    int.options.units = "metric";
  }

  // Make basic embed with all values that don't change
  const baseEmbed = new Embed()
    .URL(`https://darksky.net/forecast/${location.lat},${location.lon}/`)
    .thumbnail(`https:${current.condition.icon}`)
    .footer(`Conditions in ${location.name}, ${location.region}`)
    .field("☀️ Sunrise", astro.sunrise, true)
    .field(`:${moonPhaseEmoji(astro.moon_phase)}: Sunset`, astro.sunset, true)
    .blankField(true);

  // Add rain and snow forecast
  if (day.daily_chance_of_rain !== 0) {
    baseEmbed.description(
      `There is a ${day.daily_chance_of_rain}% chance of rain${
        day.daily_chance_of_snow === 0
          ? "."
          : ` and a ${day.daily_chance_of_snow}% chance of snow.`
      }`
    );
  } else if (day.daily_chance_of_snow !== 0) {
    baseEmbed.description(
      `There is a ${day.daily_chance_of_snow}% chance of snow.`
    );
  }

  if (int.options.units === "metric") {
    // Send data in metric if user requests it
    return int.send(
      baseEmbed
        .title(`${current.temp_c}°C, ${current.condition.text}`)
        .field("Wind", `${current.wind_kph} kph ${current.wind_dir}`, true)
        .field("Humidity", `${current.humidity}%`, true)
        .field("Visibility", `${current.vis_km} km`, true)
        .toMessage()
    );
  } else {
    // Send data in imperial by default
    return int.send(
      baseEmbed
        .title(`${current.temp_f}°F, ${current.condition.text}`)
        .field("Wind", `${current.wind_mph} mph ${current.wind_dir}`, true)
        .field("Humidity", `${current.humidity}%`, true)
        .field("Visibility", `${current.vis_miles} mi`, true)
        .toMessage()
    );
  }
};
