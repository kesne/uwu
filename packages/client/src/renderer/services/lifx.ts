import color from 'color';
import Lifx from 'node-lifx-lan';
import axios from 'axios';
import Service from './Service';
import { writable } from 'svelte/store';

type LifxTiles = {
    left: any;
    right: any;
};

const OVERHEAD_BRIGHTNESS = 0.55;
const TILE_BRIGHTNESS = 0.02;
const TILE_SELECTOR = 'group:Wall';
const WAIT = 10000;

// These are the names of the lights as configured in the Lifx app:
const LIGHTS = {
    FRONT: {
        LEFT: 'Front Left',
        RIGHT: 'Front Right',
    },
    BACK: {
        LEFT: 'Back Left',
        RIGHT: 'Back Right',
    },
    WALL: {
        LEFT: 'Wall Left',
        RIGHT: 'Wall Right',
    },
};

type RGB = [number, number, number];
type LightDef = { hue: number } | { rgb: RGB };
type Scene =
    | {
          front: LightDef;
          back: LightDef;
      }
    | LightDef;

const SCENES: Record<string, Scene> = {
    default: {
        front: {
            hue: 236,
        },
        back: {
            hue: 323,
        },
    },
    green: { rgb: [0, 255, 0] },
    red: { rgb: [255, 0, 0] },
    // 100: 'NeonNinjaAF',
    // 1000: 'NeonNinjaAf1000',
    // 200: 'drand',
    // 187: 187,
    // 666: 187,
    // 420: green
};

export const CHEER_SCENES: Record<number, string> = {
    187: 'red',
    666: 'red',
    420: 'green',
    4200: 'green',
    42000: 'green',
};

type LightState = {
    color: string;
    brightness: number;
    power: string;
};

class LifxService extends Service<LifxTiles> {
    name = 'Lifx';
    frontRgb = writable<RGB>([0, 0, 0]);
    backRgb = writable<RGB>([0, 0, 0]);

    private callAPI(path: string, method: 'get' | 'put' | 'post', data?: Record<string, any>) {
        return axios(`https://api.lifx.com/v1/lights/${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${this.settings.lifx}`,
                'Content-Type': 'application/json',
            },
            data,
        });
    }

    private setTileBrightness(amount: number) {
        return this.callAPI(`${TILE_SELECTOR}/state`, 'put', {
            power: 'on',
            brightness: amount,
        });
    }

    async startMorph() {
        await this.setTileBrightness(TILE_BRIGHTNESS);

        // Start Morph Effect:
        await this.callAPI(`${TILE_SELECTOR}/effects/morph`, 'post', { power_on: true });
    }

    async setLights(rgb: RGB) {
        await Promise.all([this.setFrontLights({ rgb }), this.setBackLights({ rgb })]);
    }

    async setScene(sceneName: string) {
        const sceneDef = SCENES[sceneName];

        let front;
        let back;
        if ('front' in sceneDef) {
            ({ front, back } = sceneDef);
        } else {
            front = back = sceneDef;
        }

        await Promise.all([this.setFrontLights(front), this.setBackLights(back)]);
    }

    private async setFrontLights(def: LightDef) {
        const { rgb, state } = this.getLightState(def);
        this.frontRgb.set(rgb);
        return this.setLightGroup(Object.values(LIGHTS.FRONT), state);
    }

    private async setBackLights(def: LightDef) {
        const { rgb, state } = this.getLightState(def);
        this.backRgb.set(rgb);
        return this.setLightGroup(Object.values(LIGHTS.BACK), state);
    }

    private setLightGroup(group: string[], state: LightState) {
        const states = group.map(label => ({
            selector: `label:${label}`,
            ...state,
        }));

        return this.callAPI('states', 'put', {
            states,
        });
    }

    private getLightState(def: LightDef) {
        const rgb =
            'hue' in def
                ? (color
                      .hsv(def.hue, 100, 100)
                      .rgb()
                      .array() as RGB)
                : def.rgb;

        const colorState =
            'hue' in def
                ? `hue:${def.hue} saturation:1.0 brightness:1.0`
                : `rgb:${def.rgb.join(',')}`;

        const state = {
            color: colorState,
            power: 'on',
            brightness: OVERHEAD_BRIGHTNESS,
        };

        return { state, rgb };
    }

    async connect() {
        // Start by turning on morph (this depends on Lifx cloud, not discovering the local devices):
        await this.startMorph();

        // Initialize the scene to the default scene:
        await this.setScene('default');

        const deviceList = await Lifx.discover({
            wait: WAIT,
        });

        console.log('Found LIFX devices:');
        console.log(deviceList);

        const left = deviceList.find(
            ({ deviceInfo }: any) => deviceInfo.label === LIGHTS.WALL.LEFT,
        );
        const right = deviceList.find(
            ({ deviceInfo }: any) => deviceInfo.label === LIGHTS.WALL.RIGHT,
        );

        if (!left) throw new Error('Could not find left tiles.');
        if (!right) throw new Error('Could not find right tiles.');

        return { left, right };
    }
}

export default new LifxService();
