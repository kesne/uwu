import websocket from './utils/websocket';
import { writable } from 'svelte/store';

const messages = writable<string[]>([]);

websocket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    switch (message.type) {
        case 'TTS':
            messages.update(m => [...m, message.userInput]);
            break;
        default:
            console.warn(`Unknown type: ${message.type}`);
            break;
    }
});

export { messages };
