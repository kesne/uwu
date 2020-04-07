import { writable, readable } from 'svelte/store';
import tmi from 'tmi.js';
import { SCENES } from './constants';

export const Colors = {
    WHITE: 'WHITE',
    BLACK: 'BLACK',
};

export const scene = writable(SCENES.STARTING);
export const chats = writable([]);
export const textColor = readable(Colors.WHITE, (set) => {
    let value = Colors.WHITE;
    const interval = setInterval(() => {
        value = value === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
        set(value);
	}, 30000);

	return function stop() {
		clearInterval(interval);
	};
});

export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

window.addEventListener('hashchange', () => {
    const nextScene = location.hash.slice(1);
    if (Object.values(SCENES).includes(nextScene)) {
        scene.set(nextScene);
    }
});

const MAX_MESSAGES = 15;
const IGNORED_USERS = ['streamlabs', 'streamelements', 'vapejuicejorbot'];

// TODO: Move this elsewhere:
const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    channels: ['diegosaurs'],
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    // Ignore messages from known bots, and messages that start with "!", which are commands for bots.
    if (IGNORED_USERS.includes(tags.username.toLowerCase()) || message.startsWith('!')) {
        return;
    }

    chats.update(prev => [{ message, tags }, ...prev].slice(0, MAX_MESSAGES));
});
