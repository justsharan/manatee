import { API_BASE_URL, SlashCreator, TransformedRequest } from "slash-create";

export class RequestHandler {
  readonly baseURL: string = API_BASE_URL;
  readonly requestTimeout: number;
  private _creator: SlashCreator;
  constructor(creator: SlashCreator) {
    this._creator = creator;
    this.requestTimeout = creator.options.requestTimeout as number;
  }
  async request(
    method: string,
    url: string,
    auth = true,
    body?: any,
    file?: any
  ): Promise<any> {
    const headers: Record<string, string> = {};
    let data: any = body;
    if (auth) {
      if (!this._creator.options.token)
        throw new Error("No token was set in the SlashCreator.");
      headers.Authorization = this._creator.options.token;
    }
    if (body) {
      if (method !== "GET" && method !== "DELETE") {
        data = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
      }
    }
    const res = await fetch("https://discord.com" + this.baseURL + url, {
      method,
      body: data,
      headers,
    });
    if (!res.ok) {
      const data = await res.text();
      throw new Error(`${method} got ${res.status} - ${data}`);
    }
    return await res.json();
  }
}

const hex2bin = (hex: string): Uint8Array => {
  const buf = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < buf.length; i++) {
    buf[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return buf;
};

export async function verify(treq: TransformedRequest) {
  const signature = hex2bin(treq.headers["x-signature-ed25519"] as string);
  const timestamp = treq.headers["x-signature-timestamp"] as string;
  const unknown = JSON.stringify(treq.body);
  return await crypto.subtle.verify(
    "NODE-ED25519",
    await crypto.subtle.importKey(
      "raw",
      hex2bin(DISCORD_PUBLIC_KEY),
      {
        name: "NODE-ED25519",
        namedCurve: "NODE-ED25519",
      },
      true,
      ["verify"]
    ),
    signature,
    new TextEncoder().encode(timestamp + unknown)
  );
}
