import verify from "./verify";

addEventListener("fetch", (event) => {
  event.respondWith(handle(event.request, event.waitUntil.bind(event)));
});

async function handle(req: Request, wait: (f: any) => void): Promise<Response> {
  // Request data
  const body = await req.text();
  const signature = req.headers.get("X-Signature-Ed25519") ?? "";
  const timestamp = req.headers.get("X-Signature-Timestamp") ?? "";

  // Validate signature
  const isValid = await verify(body, signature, timestamp);
  if (!isValid) {
    return new Response("Bad signature", { status: 401 });
  }

  const data = JSON.parse(body);
  switch (data) {
    default:
      return new Response("Bad request", { status: 400 });
  }
}
