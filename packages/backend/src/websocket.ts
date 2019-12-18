import url from 'url';
import { Server } from 'ws';
import { Server as HTTPServer } from 'http';
import { WEBSOCKET_SECRET } from './constants';

export default function websocket(server: HTTPServer) {
    const wss = new Server({ noServer: true });

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
