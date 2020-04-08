import Service from './Service';

const HOST =
    process.env.NODE_ENV === 'production' ? 'wss://uwu.vapejuicejordan.rip' : 'ws://localhost:4000';

const PING_TIMER = 5000;

export const MESSAGE_TYPES = {
    TTS: 'TTS',
    CAT_CAM: 'CAT_CAM',
    CHEER: 'CHEER',
    SET_LIGHTS: 'SET_LIGHTS',
    ENHANCE: 'ENHANCE',
    DEHANCE: 'DEHANCE',
};

class UWU extends Service<WebSocket> {
    name = 'UWU Cloud';

    async connect() {
        return new Promise<WebSocket>((resolve, reject) => {
            let resolved: boolean;
            let interval: NodeJS.Timeout;

            const websocket = new WebSocket(`${HOST}/ws/${this.settings.uwu}`);

            websocket.addEventListener('open', () => {
                resolved = true;
                resolve(websocket);

                // Send a message every 5 seconds to keep the connection alive:
                interval = setInterval(() => {
                    websocket.send('PING');
                }, PING_TIMER);
            });

            websocket.addEventListener('error', () => {
                console.log('WebSocket encountered an error.');
                reject(new Error('Could not connect to UwU Cloud.'));
            });

            websocket.addEventListener('close', () => {
                clearInterval(interval);
                // If the promise resolved, we'll attempt
                console.log('WebSocket connection closed');
                if (resolved) {
                    console.log('Attempting to reconnect in 1 second...');
                    setTimeout(() => {
                        this.connect();
                    }, 1000);
                }
            });
        });
    }
}

export default new UWU();
