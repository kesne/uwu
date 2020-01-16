import Lifx from 'node-lifx-lan';
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

    startMorph() {}

    async connect() {
        const deviceList = await Lifx.discover({
            // Wait up to 10 seconds:
            wait: 10000
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
