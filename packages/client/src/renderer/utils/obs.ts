import OBSWebSocket from 'obs-websocket-js';

const obs = new OBSWebSocket();

export const SOURCES = {
    CAT_CAM: 'Cat Cam',
};

export async function start() {
    // TODO: Swap to localhost when this runs on-machine.
    await obs.connect({ address: '192.168.1.18:4444' });
}

export default obs;
