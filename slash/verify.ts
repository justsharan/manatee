const toBinary = (hex: string): Uint8Array => {
  const buf = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < buf.length; i++) {
    buf[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return buf;
};

export default async (
  body: string,
  sig: string,
  time: string
): Promise<boolean> =>
  crypto.subtle.verify(
    "NODE-ED25519",
    await crypto.subtle.importKey(
      "raw",
      toBinary(DISCORD_PUBLIC_KEY),
      { name: "NODE-ED25519", namedCurve: "NODE-ED25519" },
      true,
      ["verify"]
    ),
    toBinary(sig),
    new TextEncoder().encode(time + body)
  );
