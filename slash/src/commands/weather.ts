import fetch from "node-fetch";
import {
  CommandContext,
  CommandOptionType,
  InteractionResponseFlags,
  SlashCommand,
  SlashCreator,
} from "slash-create";
import { EmbedBuilder } from "src/structures/EmbedBuilder";

const WEATHER_URL = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPI_KEY}&days=1`;

function moonPhaseEmoji(phase: string): string {
  return (phase.includes("moon") ? phase : `${phase} moon`)
    .toLowerCase()
    .replace(/\s/g, "_");
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

    // Make basic embed with all values that don't change
    const baseEmbed = new EmbedBuilder()
      .URL(`https://darksky.net/forecast/${location.lat},${location.lon}/`)
      .thumbnail(`https:${current.condition.icon}`)
      .footer(`Conditions in ${location.name}, ${location.region}`)
      .field("☀️ Sunrise", forecast.forecastday[0].astro.sunrise, true)
      .field(
        `:${moonPhaseEmoji(forecast.forecastday[0].astro.moon_phase)}: Sunset`,
        forecast.forecastday[0].astro.sunset,
        true
      )
      .blankField(true);

    if (ctx.options.units && ctx.options.units === "metric") {
      // Send data in metric if user requests it
      return ctx.send({
        embeds: baseEmbed
          .title(`${current.temp_c}°C, ${current.condition.text}`)
          .field("Wind", `${current.wind_kph} kph ${current.wind_dir}`, true)
          .field("Humidity", `${current.humidity}%`, true)
          .field("Visibility", `${current.vis_km} km`, true)
          .toJSONArr(),
      });
    } else {
      // Send data in imperial by default
      return ctx.send({
        embeds: baseEmbed
          .title(`${current.temp_f}°F, ${current.condition.text}`)
          .field("Wind", `${current.wind_mph} mph ${current.wind_dir}`, true)
          .field("Humidity", `${current.humidity}%`, true)
          .field("Visibility", `${current.vis_miles} mi`, true)
          .toJSONArr(),
      });
    }
  }
}
