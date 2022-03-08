import {
  Creator,
  RespondFunction,
  Server,
  SlashCreatorOptions,
  TransformedRequest,
} from "slash-create";
import { RequestHandler } from "./util";
import { verify } from "./util";

export class SlashCreator extends Creator {
  // @ts-expect-error
  readonly requestHandler: RequestHandler;
  constructor(opts: SlashCreatorOptions) {
    super(opts);
    // @ts-expect-error
    this.requestHandler = new RequestHandler(this);
  }
  withServer(server: Server) {
    if (this.server)
      throw new Error("A server was already set in this creator.");
    this.server = server;
    if (this.server.isWebserver) {
      if (!this.options.publicKey)
        throw new Error(
          "A public key is required to be set when using a webserver."
        );
      this.server.createEndpoint(
        this.options.endpointPath as string,
        // @ts-ignore
        this._onRequest.bind(this)
      );
    } else
      this.server.handleInteraction((interaction) =>
        // @ts-ignore
        this._onInteraction(interaction, null, false)
      );
    return this;
  }

  private async _onRequest(
    treq: TransformedRequest,
    respond: RespondFunction,
    wait: (f: any) => void
  ) {
    this.emit("debug", "Got request");
    const signature = treq.headers["x-signature-ed25519"] as string;
    const timestamp = treq.headers["x-signature-timestamp"] as string;
    if (
      !signature ||
      !timestamp ||
      parseInt(timestamp) <
        (Date.now() - (this.options.maxSignatureTimestamp as number)) / 1000
    )
      return respond({
        status: 401,
        body: "Invalid signature",
      });
    if (!(await verify(treq))) {
      this.emit("debug", "A request failed to be verified");
      this.emit("unverifiedRequest", treq);
      return respond({
        status: 401,
        body: "Invalid signature",
      });
    } // @ts-expect-error
    wait(this._onInteraction(treq.body, respond, true).catch(() => {}));
  }
}
