import fastify from "fastify";
import path from "path/posix";
import { FastifyServer, SlashCreator } from "slash-create";

const app = fastify({ logger: true });

// Initialize Slash creator (to handle interactions)
const creator = new SlashCreator({
  applicationID: process.env.APPLICATION_ID!,
  publicKey: process.env.PUBLIC_KEY,
  token: `Bot ${process.env.DISCORD_TOKEN}`,
});

// Log creator errors to console
creator.on("warn", console.warn);
creator.on("error", console.error);

creator
  .withServer(new FastifyServer(app))
  .registerCommandsIn(path.join(__dirname, "commands"))
  .syncCommands({ deleteCommands: true })
  .startServer();
