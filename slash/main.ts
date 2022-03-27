import { CommandInteraction } from "discord-workers";
import { InteractionType } from "discord-api-types/v10";
import verify from "./verify";
import commands from "./commands/";

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
        return commands[int.name](int, wait);
      } else {
        return int.respond(4, {
          content: "Unrecognized command",
          flags: 64,
        });
      }
    default:
      return new Response("Unrecognized interaction type", { status: 400 });
  }
}