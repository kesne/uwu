import websocket, { MESSAGE_TYPES } from './utils/websocket';
import { writable } from 'svelte/store';

export const messages = writable<string[]>([]);
export const catCam = writable<string[]>([]);

websocket.addEventListener('message', event => {
    const message = JSON.parse(event.data);

    switch (message.type) {
        case MESSAGE_TYPES.TTS:
            messages.update(m => [...m, message.userInput]);
            break;
        case MESSAGE_TYPES.CAT_CAM:
            catCam.update(c => [...c, message]);
            break;
        default:
            console.warn(`Unknown type: ${message.type}`);
            break;
    }
});
