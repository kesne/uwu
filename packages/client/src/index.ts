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
    setInterval(() => {
        ws.send(JSON.stringify({ foo: 'bar' }));
    }, 1000);
});

ws.on('close', function close() {});

ws.on('message', function incoming() {});
