import socketIO from 'socket.io';
import { Server as HTTPServer } from 'http';
// TODO: Use secret?
// import { WEBSOCKET_SECRET } from './constants';

let io: socketIO.Server;

export function sendToClient(type: string, data: Record<string, any>) {
    console.log('Sending data to websocket clients', type, data);

    if (!io) {
        throw new Error('Attempted to send to client before client was ready.');
    }

    io.emit(type, data);
}

export default function websocket(server: HTTPServer) {
    io = socketIO(server);

    io.on('connection', () => {
        console.log('Client connected');
    });
}
