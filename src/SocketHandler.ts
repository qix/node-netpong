// tslint:disable:no-console
import { pseudoRandomBytes } from "crypto";
import { Stats } from "fast-stats";
import { Socket } from "net";
import { chunkCallback } from "./chunkCallback";
import { Cycle } from "./Cycle";
import { Renderer } from "./Renderer";

let nextLine = 1;

export class SocketHandler {
  private cycles: Map<string, Cycle> = new Map();
  private name: string | null = null;
  private stats = new Stats();
  private line = nextLine++;
  private delay: number = 0;

  constructor(
    private socket: Socket,
    private renderer: Renderer,
    messageLength: number
  ) {
    this.socket = socket;
    this.cycles = new Map();
    socket.on(
      "data",
      chunkCallback(messageLength, (data: Buffer) => {
        this.handle(data);
      })
    );
    socket.on("error", err => {
      console.error("Lost socket: %s", err.toString());
      this.socket.destroy();
    });
  }

  private handle(message: Buffer) {
    if (this.name === null) {
      this.name = message.toString("utf-8");
      return;
    }

    const response = pseudoRandomBytes(message.length);
    const responseKey = response.toString("hex");

    const messageKey = message.toString("hex");
    const cycle = this.cycles.get(messageKey);

    if (cycle) {
      const takenNs = cycle.end();
      this.stats.push(takenNs);
      this.renderer.write(this.name, this.line, this.stats);

      this.cycles.delete(messageKey);

      setTimeout(() => {
        cycle.restart();
        this.cycles.set(responseKey, cycle);
        this.socket.write(response);
      }, this.delay);
    } else if (messageKey === "0".repeat(messageKey.length)) {
      this.cycles.set(responseKey, new Cycle());
      this.socket.write(response);
    } else {
      console.error("Error: Bad response %s", messageKey);
      this.socket.destroy();
    }
  }
}
