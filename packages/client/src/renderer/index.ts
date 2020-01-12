// Initial welcome page. Delete the following line to remove it.
import 'bulma';
import OBSWebSocket from 'obs-websocket-js';
import App from './App.svelte';

const OBS_SOURCES = {
    CAT_CAM: 'Cat Cam',
};

const obs = new OBSWebSocket();

async function main() {
    // TODO: Swap to 4000 when this runs on-machine.
    await obs.connect({ address: '192.168.1.18:4444' });

    await obs.send('SetSceneItemProperties', {
        item: OBS_SOURCES.CAT_CAM,
        visible: true,
        // We have to include these objects to satisfy the type, even if they are empty.
        // See: https://github.com/haganbmj/obs-websocket-js/issues/158
        bounds: {},
        scale: {},
        crop: {},
        position: {},
    });
}

main();

new App({
    target: document.getElementById('app')!,
});
