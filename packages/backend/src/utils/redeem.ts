import { TokenGrant, TokenGrantUpdateWithWhereUniqueWithoutUserInput } from '@prisma/photon';
import { photon } from '../context';

function available(grant: TokenGrant) {
    return Math.max(grant.tokens - grant.redeemed, 0);
}

export default async function redeem(
    id: string,
    tokenGrants: TokenGrant[],
    amount: number,
): Promise<boolean> {
    console.log(tokenGrants);
    const totalAvailableTokens = tokenGrants.reduce((acc, grant) => acc + available(grant), 0);

    console.log(totalAvailableTokens, amount);

    if (amount > totalAvailableTokens) {
        return false;
    }

    const updates: TokenGrantUpdateWithWhereUniqueWithoutUserInput[] = [];

    let amountToRedeem = amount;
    tokenGrants.some(grant => {
        if (available(grant) >= amountToRedeem) {
            updates.push({
                where: { id: grant.id },
                data: { redeemed: grant.redeemed + amountToRedeem },
            });
            return true;
        } else {
            updates.push({
                where: { id: grant.id },
                data: { redeemed: grant.tokens },
            });
            amountToRedeem -= available(grant);
            return false;
        }
    });

    await photon.users.update({
        where: { id },
        data: {
            tokenGrants: {
                update: updates,
            },
        },
    });

    return true;
}
