import io from 'socket.io-client';
import Service from './Service';

const HOST =
    process.env.NODE_ENV === 'production' ? 'wss://uwu.vapejuicejordan.rip' : 'ws://localhost:4000';

export const MESSAGE_TYPES = {
    TTS: 'TTS',
    CAT_CAM: 'CAT_CAM',
    CHEER: 'CHEER',
    SET_LIGHTS: 'SET_LIGHTS',
    ENHANCE: 'ENHANCE',
    DEHANCE: 'DEHANCE',
};

class UWU extends Service<SocketIOClient.Socket> {
    name = 'UWU Cloud';

    async connect() {
        return new Promise<SocketIOClient.Socket>((resolve, reject) => {
            // TODO: Use connection token from `this.settings.uwu`
            const socket = io(HOST);

            socket.on('connect', () => {
                resolve(socket);
            });

            socket.on('connect_error', (err: any) => {
                reject(err);
            });
        });
    }
}

export default new UWU();
