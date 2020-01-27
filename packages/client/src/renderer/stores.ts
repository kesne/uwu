import uwu, { MESSAGE_TYPES } from './services/uwu';
import { CHEER_SCENES } from './services/lifx';
import { writable } from 'svelte/store';

export const messages = writable<string[]>([]);
export const catCam = writable<string[]>([]);
export const cheers = writable<string[]>([]);
export const lights = writable<string[]>([]);

const append = <T>(value: T) => (values: T[]) => [...values, value];

uwu.wait().then(websocket => {
    websocket.addEventListener('message', event => {
        const message = JSON.parse(event.data);

        switch (message.type) {
            case MESSAGE_TYPES.TTS:
                messages.update(append(message.userInput));
                break;
            case MESSAGE_TYPES.CAT_CAM:
                catCam.update(append(message));
                break;
            case MESSAGE_TYPES.CHEER:
                if (CHEER_SCENES[message.amount]) {
                    lights.update(append({ scene: CHEER_SCENES[message.amount], ...message }));
                }
                break;
            case MESSAGE_TYPES.SET_LIGHTS:
                lights.update(append(message));
                break;
            default:
                console.warn(`Unknown type: ${message.type}`);
                break;
        }
    });
});
