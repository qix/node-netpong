import { pseudoRandomBytes } from "crypto";
import { createServer, Server as NetServer, Socket } from "net";
import { chunkCallback } from "./chunkCallback";
import { Renderer } from "./Renderer";
import { SocketHandler } from "./SocketHandler";

export const defaultMessageLength = 8;

export class Server {
  private server: NetServer;
  private handlers: SocketHandler[] = [];
  private renderer = new Renderer();

  constructor(messageLength = defaultMessageLength) {
    this.server = createServer(socket => {
      this.handlers.push(
        new SocketHandler(socket, this.renderer, messageLength)
      );
    });
    this.server.listen(1337, "127.0.0.1");
  }
}
