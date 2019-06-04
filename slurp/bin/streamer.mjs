import contracts from '../dat/contracts';
import { createConnection } from 'net';

const { INGRESS_SOCKET } = process.env;
const client = createConnection(INGRESS_SOCKET, () => {
  client.setEncoding('utf8');
  client.write(JSON.stringify(contracts.shift()));
});

client.on("data", (utf) => {
  console.log(JSON.parse(utf));
  const next = contracts.shift();

  if (next) {
    client.write(JSON.stringify(next));
  } else {
    client.end();
  }
});