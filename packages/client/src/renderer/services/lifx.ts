import Lifx from 'node-lifx-lan';
import axios from 'axios';
import Service from './Service';

type LifxTiles = {
    left: any;
    right: any;
};

// These are the names of the tile groups as configured in the Lifx app:
const LEFT_NAME = 'Wall Left';
const RIGHT_NAME = 'Wall Right';

class LifxService extends Service<LifxTiles> {
    name = 'Lifx';

    private callAPI(path: string, method: 'put' | 'post', data: Record<string, any>) {
        return axios(`https://api.lifx.com/v1/lights/all/${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${this.settings.lifx}`,
                'Content-Type': 'application/json',
            },
            data,
        });
    }

    setBrightness(amount: number) {
        return this.callAPI('state', 'put', {
            power: 'on',
            brightness: amount,
        });
    }

    async startMorph() {
        await this.setBrightness(0.02);

        // Start Morph Effect:
        await this.callAPI('effects/morph', 'post', { power_on: true });
    }

    async connect() {
        // Start by turning on morph (this depends on Lifx cloud, not discovering the local devices):
        await this.startMorph();

        const deviceList = await Lifx.discover({
            // Wait up to 10 seconds:
            wait: 10000,
        });

        console.log('Found LIFX devices:');
        console.log(deviceList);

        const left = deviceList.find(({ deviceInfo }: any) => deviceInfo.label === LEFT_NAME);
        const right = deviceList.find(({ deviceInfo }: any) => deviceInfo.label === RIGHT_NAME);

        if (!left) throw new Error('Could not find left tiles.');
        if (!right) throw new Error('Could not find right tiles.');

        return {
            left,
            right,
        };
    }
}

export default new LifxService();
