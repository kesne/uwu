import TwitchClient from 'twitch';
import PubSubClient, { PubSubListener } from 'twitch-pubsub-client';
import ChatClient from 'twitch-chat-client';
import redis from '../redis';
import { TWITCH_ID, TWITCH_NAME, VJJ_ACCESS_TOKEN, VJJ_REFRESH_TOKEN, REWARDS } from '../constants';
import tierToToken from '../utils/tierToTokens';
import CommandManager from './CommandManager';
import { User } from '../entity/User';
import { sendToClient } from '../websocket';

const CLIENT_ID = process.env.TWITCH_CLIENT_ID as string;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET as string;
const BOT_OAUTH = process.env.TWITCH_BOT_OAUTH as string;

class Twitch {
    client!: TwitchClient;
    pubSubClient: { client: PubSubClient; subscriptions: PubSubListener[] } | null;

    private readyPromise: Promise<unknown>;

    constructor() {
        this.readyPromise = this.start();
        this.pubSubClient = null;
    }

    async start() {
        this.client = TwitchClient.withCredentials(CLIENT_ID);
        await this.listenToChat();
        await this.listenToSubscriptions();
    }

    ready() {
        return this.readyPromise;
    }

    async provideCredentials(accessToken: string, refreshToken: string) {
        await Promise.all([
            redis.set(VJJ_ACCESS_TOKEN, accessToken),
            redis.set(VJJ_REFRESH_TOKEN, refreshToken),
        ]);

        await this.listenToSubscriptions();
    }

    private async listenToChat() {
        const twitchClient = TwitchClient.withCredentials(CLIENT_ID, BOT_OAUTH);
        const chatClient = ChatClient.forTwitchClient(twitchClient, { channels: [TWITCH_NAME] });
        await chatClient.connect();
        const commandManager = new CommandManager((channel, message) => {
            if (process.env.NODE_ENV !== 'production') {
                message += ' (DEV)';
            }

            // TODO: Don't let this hit production.
            // chatClient.say(channel, message);
        });
        chatClient.onPrivmsg((channel, _user, message, msg) => {
            commandManager.send(channel, message, msg);
        });
    }

    private async listenToSubscriptions() {
        console.log('Starting to listen to Twitch subscriptions...');

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

        if (this.pubSubClient) {
            this.pubSubClient.subscriptions.forEach((subscription) => {
                subscription.remove();
            });
            this.pubSubClient = null;
        }

        try {
            const twitchClient = TwitchClient.withCredentials(CLIENT_ID, accessToken, undefined, {
                clientSecret: CLIENT_SECRET,
                refreshToken: refreshToken,
                onRefresh(newTokens) {
                    redis.set(VJJ_ACCESS_TOKEN, newTokens.accessToken);
                    redis.set(VJJ_REFRESH_TOKEN, newTokens.refreshToken);
                },
            });

            const pubSubClient = new PubSubClient();
            await pubSubClient.registerUserListener(twitchClient);

            this.pubSubClient = {
                client: pubSubClient,
                subscriptions: [],
            };

            this.pubSubClient.subscriptions.push(
                await pubSubClient.onRedemption(TWITCH_ID, async (message) => {
                    const type = REWARDS[message.rewardId];
                    console.log(`Redemption: ${message.rewardId}`, message);

                    if (!type) return;

                    sendToClient(type, {
                        id: message.id,
                        userName: message.userName,
                        userInput: message.message,
                    });
                }),
            );

            this.pubSubClient.subscriptions.push(
                await pubSubClient.onBits(TWITCH_ID, async (message) => {
                    sendToClient('CHEER', {
                        amount: message.bits,
                        userName: message.userName,
                    });

                    if (!message.isAnonymous && message.userId && message.bits >= 100) {
                        const amount = Math.floor(message.bits / 100);
                        await User.awardTokens(
                            message.userId,
                            amount,
                            `For your cheer of ${message.bits} bits!`,
                            {
                                name: message.userName,
                            },
                        );
                    }
                }),
            );

            this.pubSubClient.subscriptions.push(
                await pubSubClient.onSubscription(TWITCH_ID, async (message) => {
                    if (message.isGift && message.gifterId) {
                        await User.awardTokens(
                            message.gifterId,
                            1,
                            'A small thank you for gifting subs!',
                            {
                                // Annoying hack around null / undefined values:
                                // TODO: Look into how Text Me Maybe handles null.
                                name: message.gifterDisplayName || undefined,
                            },
                        );
                    }

                    await User.awardTokens(
                        message.userId,
                        tierToToken(message.subPlan),
                        'Thank you for subscribing!',
                        {
                            name: message.userDisplayName,
                        },
                    );
                }),
            );

            console.log('Connected to Twitch PubSub API');
        } catch (e) {
            console.error(
                'An error occurred while setting up pubsub. The oAuth tokens have been cleared.',
            );
            console.error(e);

            // Clear the tokens to ensure that we don't attempt to use invalid creds:
            redis.del(VJJ_ACCESS_TOKEN);
            redis.del(VJJ_REFRESH_TOKEN);
        }
    }
}

export default new Twitch();
