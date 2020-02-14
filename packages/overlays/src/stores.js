import { writable } from 'svelte/store';
import tmi from 'tmi.js';

export const chats = writable([]);

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    channels: ['VapeJuiceJordan'],
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    console.log(tags);
    // "Alca: Hello, World!"
    console.log(`${tags['display-name']}: ${message}`);
    chats.update((prev) => [...prev]);
});
