import say from 'say';
import WebSocket from 'ws';
import { WEBSOCKET_SECRET } from './constants';

const HOST =
    process.env.NODE_ENV === 'production' ? 'wss://uwu.vapejuicejordan.rip' : 'ws://localhost:4000';

const ws = new WebSocket(`${HOST}/ws/${WEBSOCKET_SECRET}`, {
    origin: 'https://gossipgirl.dev',
});

// say.speak('hi');

ws.on('open', function open() {
    console.log('connected');
});

ws.on('close', function close() {
    console.log('CLOSED!');
});

function speak(message: string, args?: Record<string, string>) {
    if (args) {
        say.speak(message, args.voice || undefined, Number(args.speed) || 1, err => {
            if (err) {
                speak(message);
            }
        });
    } else {
        say.speak(message);
    }
}

ws.on('message', rawMessage => {
    const message = JSON.parse(rawMessage.toString());
    switch (message.type) {
        case 'TTS':
            // TODO: We should only parse arguments in front position, not anywhere.
            if (message.userInput.includes(':')) {
                const messageParts = message.userInput.split(' ');
                const args: Record<string, string> = {};
                const text: string[] = [];
                messageParts.forEach((part: string) => {
                    if (part.includes(':')) {
                        const [key, value] = part.split(':');
                        args[key] = value;
                    } else {
                        text.push(part);
                    }
                });

                speak(text.join(' '), args);
            } else {
                speak(message.userInput);
            }
            break;
        default:
            console.warn(`Unknown type: ${message.type}`);
            break;
    }
});
