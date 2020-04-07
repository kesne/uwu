import OBSWebSocket from 'obs-websocket-js';
import find from 'local-devices';
import Service from './Service';

const obs = new OBSWebSocket();

const CAMERA_SCENE = '-- Camera';
export const SOURCES = {
    CAT_CAM: 'Cat Cam',
    CAMLINK: 'CamLink',
};

// These are the names that my streaming PC (which runs OBS) has existed under
const STREAM_PC_NAMES = ['gaming-desktop-nzxt.localdomain'];

// For some reason we've been having issues with the vjj-streaming-pc name on network,
// so we don't use it now.
// const STREAM_PC_NAMES = ['gaming-desktop-nzxt.localdomain', 'vjj-streaming-pc.localdomain'];

class OBS extends Service<OBSWebSocket> {
    name = 'OBS';

    async zoomCamera(amount: number) {
        await this.connection.send('SetSceneItemProperties', {
            'scene-name': CAMERA_SCENE,
            item: SOURCES.CAMLINK,
            scale: {
                x: amount,
                y: amount
            },
            bounds: {},
            position: {},
            crop: {},
        });
    }

    async setCatCamVisible(visible: boolean) {
        await this.connection.send('SetSceneItemProperties', {
            item: SOURCES.CAT_CAM,
            visible,
            // These are required to satisfy the type, but not technically required
            bounds: {},
            position: {},
            scale: {},
            crop: {},
        });
    }

    async connect() {
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

        return obs;
    }
}

export default new OBS();
