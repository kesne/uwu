import OBSWebSocket from 'obs-websocket-js';
import find from 'local-devices';

const obs = new OBSWebSocket();

export const SOURCES = {
    CAT_CAM: 'Cat Cam',
};

// These are the names that my streaming PC (which runs OBS) has existed under
const STREAM_PC_NAMES = ['gaming-desktop-nzxt.localdomain', 'vjj-streaming-pc.localdomain'];

export async function start() {
    if (process.env.NODE_ENV === 'production') {
        // Production always runs on the same machine:
        await obs.connect({ address: 'localhost:4444' });
    } else {
        const devices = await find();
        const device = devices.find(device => STREAM_PC_NAMES.includes(device.name));
        if (!device) {
            throw new Error('Could not find streaming PC on network.');
        }
        await obs.connect({ address: `${device.ip}:4444` });
    }
}

export default obs;
