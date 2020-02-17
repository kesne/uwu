const ffzEmotes = {};
async function fetchFFZ() {
    console.log('FETCHING');
    const res = await fetch('https://api.frankerfacez.com/v1/room/vapejuicejordan');
    const { sets } = await res.json();
    const { emoticons } = Object.values(sets)[0];
    emoticons.forEach(emote => {
        ffzEmotes[emote.name] = Object.values(emote.urls).pop();
    });
}

// Initiate fetching of FFZ emotes:
fetchFFZ();

// TODO: This should return if the message was emote-only, because we have FFZ emote only messages as well.

// TODO: A better way to do this might be creating an ORDERED list of all
// replacement ranges, then the space between the ranges can be used to just
// grab content, and all of the message content comes from the space between
// the ranges. This should be relatively easy because the ranges are non-overlapping.
let emoteMap = {};
export default function parseMessage(message, tags) {
    let emoteMap = {};
    let words = message.split(/\s+/);

    if (tags.emotes) {
        Object.entries(tags.emotes).forEach(([id, ranges]) => {
            ranges.forEach(range => {
                const [start, end] = range.split('-').map(Number);
                const emoteText = message.slice(start, end + 1);
                emoteMap[emoteText] = id;
            });
        });
    }

    return words.map(word => {
        if (emoteMap[word]) {
            return { image: `https://static-cdn.jtvnw.net/emoticons/v1/${emoteMap[word]}/3.0` };
        }

        if (ffzEmotes[word]) {
            return { image: `https:${ffzEmotes[word]}` };
        }

        return word;
    });
}
