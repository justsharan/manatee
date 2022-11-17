import { CommandInteraction, Embed } from "discord-workers";
import { Env } from "..";
import googleMap from "../utils/googleMap";

export const name = "ip";
export const description = "View information about any public IP address";

export function execute(
  int: CommandInteraction,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const func = async () => {
    const ipAddr = int.getOption<string>("address");
    // prettier-ignore
    const resp = await fetch(`http://ip-api.com/json/${encodeURIComponent(ipAddr!)}&lang=${int.locale}`);
    const body: any = await resp.json();
    if (body.status !== "success")
      return int.send("Couldn't find any information on that IP address.");

    const map = await googleMap(
      env.googleMapsKey,
      `${body.lat},${body.lon}`,
      "hybrid",
      int.locale
    );

    const embed = new Embed()
      .setTitle(body.query)
      .setDescription(`${body.city}, ${body.region}\n${body.country}`)
      .addField("Service Provider", body.isp, true)
      .addField(
        "Local Time",
        new Date().toLocaleString(int.locale, {
          dateStyle: "long",
          timeStyle: "short",
        }),
        true
      )
      .setImage("attachment://map.png");

    return int.send({
      embeds: [embed],
      attachments: [{ name: "map.png", file: map }],
    });
  };
  return Promise.resolve(int.defer());
}
