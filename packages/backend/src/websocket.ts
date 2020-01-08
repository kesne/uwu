import url from 'url';
import WebSocket, { Server } from 'ws';
import { Server as HTTPServer } from 'http';
import { WEBSOCKET_SECRET } from './constants';

let wss: Server;

export function sendToClient(data: string) {
    console.log('sending to client!', data);

    if (!wss) {
        throw new Error('Attempted to send to client before client was ready.');
    }

    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

export default function websocket(server: HTTPServer) {
    wss = new Server({ noServer: true });

    wss.on('connection', ws => {
        console.log('Client connected');
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    server.on('upgrade', function upgrade(request, socket, head) {
        const pathname = url.parse(request.url).pathname;

        const [ws, secret] = pathname?.split('/').filter(Boolean);

        // This is a very basic thing we can do to prevent
        // just anyone from connecting:
        if (ws !== 'ws' || secret !== WEBSOCKET_SECRET) {
            console.log('destroying socket...');
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    });
}
