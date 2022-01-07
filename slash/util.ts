export function codeBlock(code: string, lang = ""): string {
  return `
\`\`\`${lang}
${code}
\`\`\`
  `;
}
