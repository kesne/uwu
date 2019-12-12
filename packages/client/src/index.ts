import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8081/ws', {
    origin: 'https://gossipgirl.dev',
});

ws.on('open', function open() {
    console.log('connected');
    setInterval(() => {
        ws.send(JSON.stringify({ foo: 'bar' }));
    }, 1000);
});

ws.on('close', function close() {});

ws.on('message', function incoming() {});
