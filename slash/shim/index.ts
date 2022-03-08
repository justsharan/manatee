import { RespondFunction, Server, TransformedRequest } from "slash-create";
export * from "./creator";
export * from "./util";
export type ServerRequestHandler = (
  treq: TransformedRequest,
  respond: RespondFunction,
  wait: (f: any) => void
) => void;
export class CFWorkerServer extends Server {
  constructor() {
    super({ alreadyListening: true });
    this.isWebserver = true;
  }
  createEndpoint(path: string, handler: ServerRequestHandler) {
    addEventListener("fetch", (event) => {
      if (event.request.method !== "POST")
        return event.respondWith(
          new Response("Server only supports POST requests.", { status: 405 })
        );
      return event.respondWith(
        new Promise(async (resolve) => {
          const body = await event.request.text();
          handler(
            {
              headers: Object.fromEntries(event.request.headers.entries()),
              body: body ? JSON.parse(body) : body,
              request: event.request,
              response: null,
            },
            async (response) => {
              resolve(
                new Response(JSON.stringify(response.body), {
                  status: response.status || 200,
                  headers: {
                    ...((response.headers || {}) as Record<string, string>),
                    "content-type": "application/json",
                  },
                })
              );
            },
            event.waitUntil.bind(event)
          );
        })
      );
    });
  }
}
