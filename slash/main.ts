import { CommandInteraction, Interaction } from "discord-workers";
import { InteractionType } from "discord-api-types/v10";
import verify from "./verify";
import commands from "./commands/";
import components from "./components/";

addEventListener("fetch", (event: FetchEvent) =>
  event.respondWith(handle(event.request, event.waitUntil.bind(event)))
);

async function handle(req: Request, wait: (f: any) => void): Promise<Response> {
  const body = await req.text();
  const signature = req.headers.get("X-Signature-Ed25519") ?? "";
  const timestamp = req.headers.get("X-Signature-Timestamp") ?? "";

  // Validate signature
  const isValid = await verify(body, signature, timestamp);
  if (!isValid) {
    return new Response("Bad signature", { status: 401 });
  }

  const data = JSON.parse(body);
  switch (data.type) {
    case InteractionType.Ping:
      return new Response(JSON.stringify({ type: 1 }));
    case InteractionType.ApplicationCommand:
      const int = new CommandInteraction(data, true);
      if (int.name in commands) {
        const user = int.member ? int.member.user! : int.user!;
        await fetch(
          `https://discord.com/api/webhooks/${WEBHOOK_ID}/${WEBHOOK_TOKEN}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: [
                `**Action**: \`${user.username}#${user.discriminator}\` (${user.id}) executed the \`${int.name}\` command.`,
                `**Options**: ${Object.entries(int.options)
                  .map(([k, v]) => `${k}:\`${v}\``)
                  .join(" ")}`,
                `**Time**: <t:${Math.round(Date.now() / 1000)}>`,
              ].join("\n"),
            }),
          }
        );
        return commands[int.name](int, wait);
      } else {
        return int.respond(4, {
          content: "Unrecognized command",
          flags: 64,
        });
      }
    case InteractionType.MessageComponent:
      for (const c of components) {
        const res = await c(new Interaction(data, true), wait);
        if (res instanceof Response) {
          return res;
        }
      }
    default:
      return new Response("Unrecognized interaction type", { status: 400 });
  }
}
