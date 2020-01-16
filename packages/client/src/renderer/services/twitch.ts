import { Client } from 'tmi.js';
import Service from './Service';

const CHANNEL = 'VapeJuiceJordan';

class Twitch extends Service<Client> {
    name = 'Twitch';

    send(message: string)  {
        return this.connection.say(CHANNEL, message);
    }

    async connect() {
        const client = Client({
            connection: {
                secure: true,
                reconnect: true,
            },
            identity: {
                username: 'VapeJuiceJorbot',
                password: `oauth:${this.settings.twitch}`
            },
            channels: [CHANNEL],
        });

        await client.connect();

        return client;
    }
}

export default new Twitch();
