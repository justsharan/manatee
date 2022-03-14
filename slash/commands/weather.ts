import fetch from "node-fetch";
import {
  CommandContext,
  CommandOptionType,
  InteractionResponseFlags,
  SlashCommand,
  SlashCreator,
} from "slash-create";
import { EmbedBuilder } from "../utils/EmbedBuilder";

const WEATHER_URL = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPI_KEY}&days=1`;

function moonPhaseEmoji(phase: string): string {
  phase = phase.toLowerCase();
  return (phase.includes("moon") ? phase : `${phase} moon`).replace(/\s/g, "_");
}

export default class extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "weather",
      description: "View the weather for a particular location.",
      options: [
        {
          name: "location",
          description: "The location to get weather info about.",
          type: CommandOptionType.STRING,
          required: true,
        },
        {
          name: "units",
          description: "What units you'd like the info in.",
          type: CommandOptionType.STRING,
          choices: [
            { name: "metric", value: "metric" },
            { name: "imperial", value: "imperial" },
          ],
        },
      ],
    });
  }

  async run(ctx: CommandContext) {
    const res = await fetch(`${WEATHER_URL}&q=${ctx.options.location}`);
    if (res.status === 400) {
      return ctx.send({
        content: "No weather data found for that location.",
        flags: InteractionResponseFlags.EPHEMERAL,
      });
    }

    const { location, current, forecast } = await res.json();
    const { astro, day } = forecast.forecastday[0];

    if (!ctx.options.units && location.country !== "United States of America") {
      ctx.options.units = "metric";
    }

    // Make basic embed with all values that don't change
    const baseEmbed = new EmbedBuilder()
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

    if (ctx.options.units && ctx.options.units === "metric") {
      // Send data in metric if user requests it
      return ctx.send(
        baseEmbed
          .title(`${current.temp_c}°C, ${current.condition.text}`)
          .field("Wind", `${current.wind_kph} kph ${current.wind_dir}`, true)
          .field("Humidity", `${current.humidity}%`, true)
          .field("Visibility", `${current.vis_km} km`, true)
          .toMessage()
      );
    } else {
      // Send data in imperial by default
      return ctx.send(
        baseEmbed
          .title(`${current.temp_f}°F, ${current.condition.text}`)
          .field("Wind", `${current.wind_mph} mph ${current.wind_dir}`, true)
          .field("Humidity", `${current.humidity}%`, true)
          .field("Visibility", `${current.vis_miles} mi`, true)
          .toMessage()
      );
    }
  }
}
