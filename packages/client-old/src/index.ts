import './backend';
import path from 'path';
import WebSocket from 'ws';
import Bundler from 'parcel-bundler';
import express from 'express';
import { WEBSOCKET_SECRET } from './constants';
import { ttsRequests } from './backend';

const app = express();

const entryFiles = path.join(__dirname, './ui/index.html');
const bundler = new Bundler(entryFiles, {
    watch: true
});

app.use(bundler.middleware());
app.listen(1234, () => console.log('UwU Client started on port 1234.'));

const HOST =
    process.env.NODE_ENV === 'production' ? 'wss://uwu.vapejuicejordan.rip' : 'ws://localhost:4000';

const ws = new WebSocket(`${HOST}/ws/${WEBSOCKET_SECRET}`, {
    origin: 'https://gossipgirl.dev',
});

ws.on('open', function open() {
    console.log('connected');
});

ws.on('close', function close() {
    console.log('CLOSED!');
});

ws.on('message', rawMessage => {
    console.log(rawMessage);
    const message = JSON.parse(rawMessage.toString());
    switch (message.type) {
        case 'TTS':
            ttsRequests.forEach(request => {
                request.next!(message.userInput);
            });
            // TODO: We should only parse arguments in front position, not anywhere.
            // if (message.userInput.includes(':')) {
            //     const messageParts = message.userInput.split(' ');
            //     const args: Record<string, string> = {};
            //     const text: string[] = [];
            //     messageParts.forEach((part: string) => {
            //         if (part.includes(':')) {
            //             const [key, value] = part.split(':');
            //             args[key] = value;
            //         } else {
            //             text.push(part);
            //         }
            //     });

            //     speak(text.join(' '), args);
            // } else {
            //     speak(message.userInput);
            // }
            break;
        default:
            console.warn(`Unknown type: ${message.type}`);
            break;
    }
});
