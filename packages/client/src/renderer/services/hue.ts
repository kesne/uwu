import color from 'color';
import hue from 'node-hue-api';
import Api from 'node-hue-api/lib/api/Api';
import { writable } from 'svelte/store';
import Service from './Service';
import { xyToRgb } from '../utils/xy';

const { LightState } = hue.v3.lightStates;

async function discoverBridge() {
    const discoveryResults = await hue.v3.discovery.nupnpSearch();

    if (discoveryResults.length === 0) {
        throw new Error('Could not find any Hue Bridges');
    }

    // We only have one hue bridge on the network:
    return discoveryResults[0].ipaddress;
}

type LightStateInstance = InstanceType<typeof LightState>;
type XY = [number, number];
type RGB = [number, number, number];
type LightDef = { xy: XY } | { rgb: RGB };
type Scene = {
    front: LightDef;
    back: LightDef;
};

const SCENES: Record<string, Scene> = {
    default: {
        front: { xy: [0.1541, 0.0836] },
        back: { xy: [0.5209, 0.2265] },
    },
    // 100: 'NeonNinjaAF',
    // 1000: 'NeonNinjaAf1000',
    // 200: 'drand',
    // 187: 187,
    // 666: 187,
    // 420: green
};

const LIGHTS = {
    FRONT: {
        LEFT: 5,
        RIGHT: 6,
    },
    BACK: {
        LEFT: 7,
        RIGHT: 8,
    },
};

class Hue extends Service<Api> {
    name = 'Philips Hue';
    frontRgb = writable<RGB>([0, 0, 0]);
    backRgb = writable<RGB>([0, 0, 0]);

    async setLights(desiredColor: string) {
        const c = color(desiredColor).rgb();
        const rgb = c.array() as RGB;

        // TODO: revert light state:
        await Promise.all([this.setFrontLights({ rgb }), this.setBackLights({ rgb })]);
    }

    async setScene(sceneName: string) {
        const { front, back } = SCENES[sceneName];

        await Promise.all([this.setFrontLights(front), this.setBackLights(back)]);
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

    private getLightState(def: LightDef) {
        const state = new LightState().on(true).brightness(100);

        let rgb: RGB;
        if ('rgb' in def) {
            rgb = def.rgb;
            state.rgb(...def.rgb);
            if (color.rgb(def.rgb).luminosity() < 0.1) {
                state.off();
            }
        } else {
            rgb = xyToRgb(...def.xy);
            state.xy(...def.xy);
        }

        return { state, rgb };
    }

    private setFrontLights(def: LightDef) {
        const { state, rgb } = this.getLightState(def);
        this.frontRgb.set(rgb);
        return this.setLightGroup(Object.values(LIGHTS.FRONT), state);
    }

    private setBackLights(def: LightDef) {
        const { state, rgb } = this.getLightState(def);
        this.backRgb.set(rgb);
        return this.setLightGroup(Object.values(LIGHTS.BACK), state);
    }

    private setLightGroup(group: number[], state: LightStateInstance) {
        return group.map(light => this.connection.lights.setLightState(light, state));
    }
}

export default new Hue();
