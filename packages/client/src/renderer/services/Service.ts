import store from '../utils/store';
import { SETTINGS_KEY } from '../constants';

type Settings = {
    uwu: string;
    hue: string;
    lifx: string;
};

type Callback<T> = (value: T) => void;

export default abstract class Service<T> {
    declare connection: T;

    private waits: Callback<T>[] = [];

    // We use a getter here to ensure we always access the latest settings:
    get settings(): Settings {
        return store.get(SETTINGS_KEY, {
            uwu: '',
            hue: '',
            lifx: '',
        });
    }

    wait(): Promise<T> {
        if (this.connection) {
            return Promise.resolve(this.connection);
        }

        return new Promise(resolve => this.waits.push(resolve));
    }

    async start() {
        // We've already started, no-op.
        if (this.connection) {
            return;
        }

        this.connection = await this.connect();
        this.waits.forEach(cb => cb(this.connection));
        this.waits = [];
    }

    abstract declare name: string;
    abstract async connect(): Promise<T>;
}
