import path from "path";
import { SlashCreator, VercelServer } from "slash-create";
import Sentry, { Severity } from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// Initialize Slash creator (to handle interactions)
export const creator = new SlashCreator({
  applicationID: process.env.APPLICATION_ID!,
  publicKey: process.env.PUBLIC_KEY,
  token: `Bot ${process.env.DISCORD_TOKEN}`,
});

// Log creator errors to console
if (process.env.NODE_ENV === "production") {
  creator.on("warn", console.warn);
  creator.on("error", (err) =>
    Sentry.captureException(err, (scope) => scope.setLevel(Severity.Warning))
  );
  creator.on("commandError", (cmd, err, ctx) => {
    Sentry.captureException(err, (scope) =>
      scope
        .setUser({
          id: ctx.user.id,
          username: `${ctx.user.username}#${ctx.user.discriminator}`,
        })
        .setTag("command", cmd.commandName)
        .setTag("guild", ctx.guildID)
        .setContext("options", ctx.options)
        .setLevel(Severity.Error)
    );
    ctx.send({
      content: "An error occurreed while running this command.",
      ephemeral: true,
    });
  });
} else {
  creator.on("warn", console.warn);
  creator.on("error", console.error);
  creator.on("commandError", (_, err) => console.error(err));
}

creator
  .withServer(new VercelServer())
  .registerCommandsIn(path.join(__dirname, "..", "commands"))
  .syncCommands({ deleteCommands: true });

export default (creator.server as VercelServer).vercelEndpoint;
