import { createServer } from 'net';
import { unlink } from 'fs';
import { calculate } from '../src/router';

const { INGRESS_SOCKET } = process.env;

unlink(INGRESS_SOCKET, () => { });

const server = createServer(client => {
    client.setEncoding('utf8');
    client.on('data', utf => {
        const contract = JSON.parse(utf);
        client.write(JSON.stringify(calculate(contract.consignor, contract.consignee)));
    });
});

server.listen(INGRESS_SOCKET);
