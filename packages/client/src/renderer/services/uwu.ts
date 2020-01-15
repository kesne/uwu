import Service from './Service';

const HOST =
    process.env.NODE_ENV === 'production' ? 'wss://uwu.vapejuicejordan.rip' : 'ws://localhost:4000';

export const MESSAGE_TYPES = {
    TTS: 'TTS',
    CAT_CAM: 'CAT_CAM',
    CHEER: 'CHEER',
    SET_LIGHTS: 'SET_LIGHTS'
};

class UWU extends Service<WebSocket> {
    name = 'UWU Cloud';

    async connect() {
        return new Promise<WebSocket>((resolve, reject) => {
            const websocket = new WebSocket(`${HOST}/ws/${this.settings.uwu}`);

            websocket.addEventListener('open', () => {
                resolve(websocket);
            });

            websocket.addEventListener('error', () => {
                reject(new Error('Could not connect to UwU Cloud.'));
            });
        });
    }
}

export default new UWU();
