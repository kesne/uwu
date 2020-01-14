import hue from 'node-hue-api';
import Api, { Light } from 'node-hue-api/lib/api/Api';
import Service from './Service';

const { LightState } = hue.v3.lightStates;

async function discoverBridge() {
    const discoveryResults = await hue.v3.discovery.nupnpSearch();

    if (discoveryResults.length === 0) {
        throw new Error('Could not find any Hue Bridges');
    }

    // We only have one hue bridge on the network:
    return discoveryResults[0].ipaddress;
}

type LightDef =
    | {
          xy: [number, number];
      }
    | {
          rgb: [number, number, number];
      };

type Scene = {
    front: LightDef;
    back: LightDef;
};

const SCENES: Record<string, Scene> = {
    default: {
        front: { xy: [0.1541, 0.0836] },
        back: { xy: [0.5209, 0.2265] },
    },
};

const LIGHTS = {
    FRONT_LEFT: 5,
    FRONT_RIGHT: 6,
    BACK_RIGHT: 7,
    BACK_LEFT: 8,
};

class Hue extends Service<Api> {
    name = 'Philips Hue';

    async setScene(sceneName: string) {
        const { front, back } = SCENES[sceneName];

        const frontState = new LightState().on(true).brightness(100);
        const backState = new LightState().on(true).brightness(100);

        if ('rgb' in front) {
            frontState.rgb(...front.rgb);
        } else {
            frontState.xy(...front.xy);
        }

        if ('rgb' in back) {
            backState.rgb(...back.rgb);
        } else {
            backState.xy(...back.xy);
        }

        await Promise.all([
            this.connection.lights.setLightState(LIGHTS.FRONT_LEFT, frontState),
            this.connection.lights.setLightState(LIGHTS.FRONT_RIGHT, frontState),
            this.connection.lights.setLightState(LIGHTS.BACK_LEFT, backState),
            this.connection.lights.setLightState(LIGHTS.BACK_RIGHT, backState),
        ]);
    }

    async connect() {
        const ipAddress = await discoverBridge();
        const api = await hue.v3.api
            .createLocal(ipAddress)
            .connect(this.settings.hue, null, 10 * 1000);

        // After we start, we also initialize the scene to the default scene:
        setTimeout(() => {
            this.setScene('default');
        });

        return api;
    }
}

export default new Hue();
