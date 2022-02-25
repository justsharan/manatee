import fetch from "node-fetch";
import {
  CommandContext,
  CommandOptionType,
  SlashCommand,
  SlashCreator,
} from "slash-create";
import { codeBlock } from "../utils/funcs";
import { EmbedBuilder } from "../utils/EmbedBuilder";

const GITHUB_API_URL = "https://api.github.com";
const type = (s: string): string => (s.includes("/") ? "repo" : "user");

export default class extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "github",
      description: "View information on GitHub repos or users.",
      options: [
        {
          type: CommandOptionType.STRING,
          name: "name",
          description: "The user or repository you'd like to see.",
          required: true,
        },
      ],
    });
  }

  async run(ctx: CommandContext) {
    const { name } = ctx.options;
    const res = await fetch(`${GITHUB_API_URL}/${type(name)}s/${name}`);
    if (!res.ok) {
      return ctx.send({
        content: `I couldn't find that Github ${type(name)}!`,
        ephemeral: true,
      });
    }

    const body = await res.json();
    return ctx.send(
      type(name) == "repo"
        ? new EmbedBuilder()
            .title(body.name)
            .URL(`https://github.com/${body.owner.login}/${body.name}`)
            .author(
              body.owner.login,
              body.owner.avatar_url,
              `https://github.com/${body.owner.login}`
            )
            .field("Clone URL", codeBlock(`git clone ${body.git_url}`))
            .field("Language", body.language, true)
            .field("License", body.license ? body.license.name : "None", true)
            .field("Stars", `⭐️ ${body.stargazers_count}`, true)
            .footer("Last updated")
            .timestamp(body.updated_at)
            .description(body.description ?? "No description")
            .toMessage()
        : new EmbedBuilder()
            .title(body.name)
            .URL(`https://github.com/${body.login}`)
            .thumbnail(body.avatar_url)
            .description(body.bio ?? "This person has no bio.")
            .field("Location", `📍 ${body.location ?? "Earth"}`, true)
            .field("Blog", body.blog ?? "Unknown", true)
            .field(
              "Stats",
              `${body.public_repos} repos / ${body.public_gists} gists`,
              true
            )
            .footer("Joined GitHub on")
            .timestamp(body.created_at)
            .toMessage()
    );
  }
}
