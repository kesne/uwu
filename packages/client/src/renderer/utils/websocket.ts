import { WEBSOCKET_SECRET } from '../constants';

export const MESSAGE_TYPES = {
    TTS: 'TTS',
    CAT_CAM: 'CAT_CAM',
};

const HOST =
    process.env.NODE_ENV === 'production' ? 'wss://uwu.vapejuicejordan.rip' : 'ws://localhost:4000';

export default new WebSocket(`${HOST}/ws/${WEBSOCKET_SECRET}`);
