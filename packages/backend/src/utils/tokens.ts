import TwitchClient from 'twitch';
import { Token, User } from '@prisma/photon';
import { awardTokens } from '../utils/users';
import { photon } from '../context';

export async function redeem(id: string, tokens: Token[], amount: number): Promise<boolean> {
    if (amount > tokens.length) {
        return false;
    }

    const tokensToUse = tokens.slice(0, amount);

    const updates = tokensToUse.map(token => ({
        where: {
            id: token.id,
        },
        data: {
            used: true,
        },
    }));

    await photon.users.update({
        where: { id },
        data: {
            tokens: {
                update: updates,
            },
        },
    });

    return true;
}

export async function gift(twitch: TwitchClient, user: User, username: string, amount: number) {
    const twitchUser = await twitch.helix.users.getUserByName(username);

    if (!twitchUser) {
        throw new Error(`Unable to find user "${username}".`);
    }

    if (twitchUser.id === user.id) {
        throw new Error('You cannot gift tokens to yourself.');
    }

    const tokens = await photon.tokens.findMany({
        where: {
            used: false,
            user: { id: user.id },
        },
    });

    const hasEnoughTokens = await redeem(user.id, tokens, amount);

    if (!hasEnoughTokens) {
        throw new Error('You do not have enough tokens to gift.');
    }

    await awardTokens(twitchUser.id, amount, `A gift from ${user.name}!`, {
        name: twitchUser.displayName,
    });

    return user;
}
