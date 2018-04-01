// tslint:disable:no-console
import { pseudoRandomBytes } from 'crypto';
import { createServer, Server as NetServer, Socket } from 'net';
import { chunkCallback } from './chunkCallback';
import { defaultMessageLength } from './Server';
import { SocketHandler } from './SocketHandler';

export class Client {
  private socket = new Socket();
  private handlers: SocketHandler[] = [];

  constructor(name: string, private messageLength = defaultMessageLength) {
    let nameBuffer = Buffer.from(name, 'utf-8');
    if (nameBuffer.length > messageLength) {
      throw new Error('Provided name was too long');
    } else if (nameBuffer.length < messageLength) {
      nameBuffer = Buffer.concat([
        Buffer.from(' '.repeat(messageLength - nameBuffer.length), 'ascii'),
        nameBuffer,
      ]);
    }

    this.socket.connect(1337, '127.0.0.1', () => {
      // connected
      console.log('CONNECTED');
    });
    this.socket.on(
      'data',
      chunkCallback(messageLength, data => {
        this.socket.write(data);
      })
    );
    this.socket.write(nameBuffer);
  }

  public startCycle() {
    this.socket.write(Buffer.alloc(this.messageLength));
  }
}
