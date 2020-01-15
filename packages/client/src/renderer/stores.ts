import uwu, { MESSAGE_TYPES } from './services/uwu';
import { writable } from 'svelte/store';

export const messages = writable<string[]>([]);
export const catCam = writable<string[]>([]);
export const cheers = writable<string[]>([]);
export const lights = writable<string[]>([]);

uwu.wait().then(websocket => {
    websocket.addEventListener('message', event => {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case MESSAGE_TYPES.TTS:
                messages.update(m => [...m, message.userInput]);
                break;
            case MESSAGE_TYPES.CAT_CAM:
                catCam.update(c => [...c, message]);
                break;
            case MESSAGE_TYPES.CHEER:
                cheers.update(c => [...c, message.amount]);
                break;
            case MESSAGE_TYPES.SET_LIGHTS:
                lights.update(c => [...c, message.userInput]);
                break;
            default:
                console.warn(`Unknown type: ${message.type}`);
                break;
        }
    });
});
