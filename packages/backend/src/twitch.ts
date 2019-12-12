import TwitchClient from 'twitch';

let client: TwitchClient;

export function getClient(): TwitchClient | Promise<TwitchClient> {
    if (!client) {
        return TwitchClient.withCredentials(process.env.TWITCH_CLIENT_ID as string).then(
            twitchClient => {
                client = twitchClient;
                return client;
            },
        );
    }

    return client;
}
