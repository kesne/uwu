import store from './store';
import { SETTINGS_KEY } from '../constants';

export const MESSAGE_TYPES = {
    TTS: 'TTS',
    CAT_CAM: 'CAT_CAM',
};

const HOST =
    process.env.NODE_ENV === 'production' ? 'wss://uwu.vapejuicejordan.rip' : 'ws://localhost:4000';

type Callback = (websocket: WebSocket) => void;
let waits: Callback[] = [];
export function onWebsocket(): Promise<WebSocket> {
    return new Promise(resolve => waits.push(resolve));
}

export function start() {
    return new Promise((resolve, reject) => {
        const settings = store.get(SETTINGS_KEY, {});
        const websocket = new WebSocket(`${HOST}/ws/${settings.websocket || ''}`);
        websocket.addEventListener('open', () => {
            resolve();
            waits.forEach(cb => cb(websocket));
            waits = [];
        });
        websocket.addEventListener('error', () => {
            reject(new Error('Could not connect to WebSocket.'));
        });
    });
}
