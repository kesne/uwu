import uwu, { MESSAGE_TYPES } from './services/uwu';
import { CHEER_SCENES } from './services/lifx';
import { writable } from 'svelte/store';

export const messages = writable<string[]>([]);
export const catCam = writable<string[]>([]);
export const cheers = writable<string[]>([]);
export const lights = writable<any[]>([]);
export const enhance = writable<number>(1);

const append = <T>(value: T) => (values: T[]) => [...values, value];

uwu.wait().then((socket) => {
    socket.on(MESSAGE_TYPES.TTS, (message: any) => {
        messages.update(append(message));
    });

    socket.on(MESSAGE_TYPES.CAT_CAM, (message: any) => {
        catCam.update(append(message));
    });

    socket.on(MESSAGE_TYPES.CHEER, (message: any) => {
        if (CHEER_SCENES[message.amount]) {
            lights.update(append({ scene: CHEER_SCENES[message.amount], ...message }));
        }
    });

    socket.on(MESSAGE_TYPES.SET_LIGHTS, (message: any) => {
        lights.update(append(message));
    });

    socket.on(MESSAGE_TYPES.ENHANCE, (message: any) => {
        console.log('GOT ENHANCE');
        enhance.update((value) => value + 1);
    });

    socket.on(MESSAGE_TYPES.DEHANCE, (message: any) => {
        enhance.update((value) => Math.max(value / 2, 1));
    });
});
