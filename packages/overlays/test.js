const tmi = require('tmi.js');

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    channels: ['primalcinder'],
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    console.log(tags);
    // "Alca: Hello, World!"
    console.log(`${tags['display-name']}: ${message}`);
});

// LINK TO EMOTES:
// https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0

// FFZ:
// https://api.frankerfacez.com/v1/room/vapejuicejordan

// Split on space and find any of these and display them.


// const { EmoteFetcher, EmoteParser } = require('twitch-emoticons');

// const fetcher = new EmoteFetcher();
// const parser = new EmoteParser(fetcher, {
//     type: 'markdown',
//     match: /:(.+?):/g
// });

// fetcher.fetchTwitchEmotes().then(() => {
//     const kappa = fetcher.emotes.get('Kappa').toLink();
//     console.log(kappa);
//     // https://static-cdn.jtvnw.net/emoticons/v1/25/1.0

//     const text = 'Hello :PogChamp:!';
//     const parsed = parser.parse(text);
//     console.log(parsed);
//     // Hello ![PogChamp](https://static-cdn.jtvnw.net/emoticons/v1/88/1.0 "PogChamp")!
// }).catch(console.error);
