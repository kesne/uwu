import { User } from '@prisma/photon';
import { photon } from '../context';

export function awardTokens(
    twitchID: string,
    amount: number,
    reason: string,
    extraData?: Partial<User>,
) {
    const tokens = Array.from({ length: amount }, () => ({
        reason,
    }));

    return photon.users.upsert({
        where: {
            twitchID,
        },
        update: {
            ...extraData,
            tokens: {
                create: tokens,
            },
        },
        create: {
            twitchID,
            ...extraData,
            tokens: {
                create: tokens,
            },
        },
    });
}
