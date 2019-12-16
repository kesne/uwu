import TwitchClient from 'twitch';
import PubSubClient from 'twitch-pubsub-client';
import ChatClient from 'twitch-chat-client';
import redis from '../redis';
import { TWITCH_ID, TWITCH_NAME, VJJ_ACCESS_TOKEN, VJJ_REFRESH_TOKEN } from '../constants';
import { awardTokens } from '../utils/users';
import tierToToken from '../utils/tierToTokens';
import CommandManager from './CommandManager';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID as string;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET as string;
const BOT_OAUTH = process.env.TWITCH_BOT_OAUTH as string;

export default class Twitch {
    client!: TwitchClient;

    private readyPromise: Promise<unknown>;

    constructor() {
        this.readyPromise = this.start();
    }

    async start() {
        await TwitchClient.withCredentials(CLIENT_ID).then(client => {
            this.client = client;
        });
        await this.listenToChat();
        await this.listenToSubscriptions();
    }

    ready() {
        return this.readyPromise;
    }

    private async listenToChat() {
        const twitchClient = await TwitchClient.withCredentials(CLIENT_ID, BOT_OAUTH);
        const chatClient = await ChatClient.forTwitchClient(twitchClient);
        await chatClient.connect();
        await chatClient.waitForRegistration();
        await chatClient.join(TWITCH_NAME);
        const commandManager = new CommandManager(this.client, (channel, message) => {
            chatClient.say(channel, message);
        });
        chatClient.onPrivmsg((channel, _user, message, msg) => {
            commandManager.send(channel, message, msg);
        });
    }

    private async listenToSubscriptions() {
        const [accessToken, refreshToken] = await Promise.all([
            redis.get(VJJ_ACCESS_TOKEN),
            redis.get(VJJ_REFRESH_TOKEN),
        ]);

        if (!accessToken || !refreshToken) {
            console.warn(
                'Unable to load the root users OAuth access or refresh tokens. Subscriptions to twitch events are not active.',
            );
            return;
        }

        const twitchClient = await TwitchClient.withCredentials(CLIENT_ID, accessToken, undefined, {
            clientSecret: CLIENT_SECRET,
            refreshToken: refreshToken,
            onRefresh(newTokens) {
                redis.set(VJJ_ACCESS_TOKEN, newTokens.accessToken);
                redis.set(VJJ_REFRESH_TOKEN, newTokens.refreshToken);
            },
        });

        const pubSubClient = new PubSubClient();
        await pubSubClient.registerUserListener(twitchClient);

        await pubSubClient.onBits(TWITCH_ID, async message => {
            if (!message.isAnonymous && message.userId && message.bits >= 100) {
                const amount = Math.floor(message.bits / 100);
                await awardTokens(
                    message.userId,
                    amount,
                    `For your cheer of ${message.bits} bits!`,
                    {
                        name: message.userName,
                    },
                );
            }
        });

        await pubSubClient.onSubscription(TWITCH_ID, async message => {
            if (message.isGift && message.gifterId) {
                await awardTokens(message.gifterId, 1, 'A small thank you for gifting subs!', {
                    name: message.gifterDisplayName,
                });
            }

            await awardTokens(
                message.userId,
                tierToToken(message.subPlan),
                'Thank you for subscribing!',
                {
                    name: message.userDisplayName,
                },
            );
        });
    }
}
