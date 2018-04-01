// tslint:disable:no-console
import { docopt } from 'docopt';

const doc = `
Usage:
  netpong server
  netpong client <name>
`;
const version = 0.1;

const options = docopt(doc, { version });

import { Client } from './Client';
import { defaultMessageLength, Server } from './Server';

if (options.server) {
  const server = new Server();
} else if (options.client) {
  const client = new Client(options['<name>']);
  client.startCycle();
}
