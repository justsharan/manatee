import fetch, { Response } from "node-fetch";

export function codeBlock(code: string, lang = ""): string {
  return `
\`\`\`${lang}
${code}
\`\`\`
  `;
}

export function inlineCodeBlock(code: string): string {
  return `\`${code}\``;
}

export function executeWebhook(url: string, body: object): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
