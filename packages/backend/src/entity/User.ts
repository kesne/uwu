import TwitchClient from 'twitch';
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { Token } from './Token';

@Entity()
export class User extends BaseEntity {
    static async awardTokens(
        twitchID: string,
        amount: number,
        reason: string,
        extraParams: Partial<User> = {},
    ) {
        const user = await User.getOrCreateUser(twitchID, extraParams);

        const tokens = Array.from({ length: amount }, () => {
            const token = new Token();
            token.reason = reason;
            token.user = user as User;
            return token;
        });

        await Token.save(tokens);
    }

    static async getOrCreateUser(twitchID: string, extraParams: Partial<User> = {}) {
        let user = await User.findOne({ where: { twitchID } });

        if (!user) {
            user = new User();
            user.twitchID = twitchID;
            Object.assign(user, extraParams);

            await user.save();
        }

        return user;
    }

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn()
    createdAt!: string;

    @UpdateDateColumn()
    updatedAt!: string;

    @Column({ unique: true })
    twitchID!: String;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    email?: string;

    @OneToMany(
        () => Token,
        token => token.user,
        {
            cascade: true,
        },
    )
    tokens!: Token[];

    // TODO: At some point we need to figure out a better way to lazily resolve
    // twitch clients from anywhere.
    async gift(twitch: TwitchClient, username: string, amount: number) {
        if (amount <= 0) {
            throw new Error('You must gift a number of tokens greater than 0.');
        }

        const twitchUser = await twitch.helix.users.getUserByName(username);

        if (!twitchUser) {
            throw new Error(`Unable to find user "${username}".`);
        }

        if (twitchUser.id === this.twitchID) {
            throw new Error('You cannot gift tokens to yourself.');
        }

        const hasEnoughTokens = await this.redeem(amount);

        if (!hasEnoughTokens) {
            throw new Error('You do not have enough tokens to gift.');
        }

        await User.awardTokens(twitchUser.id, amount, `A gift from ${this.name}!`, {
            name: twitchUser.displayName,
        });

        return this;
    }

    async redeem(amount: number) {
        if (amount <= 0) {
            return false;
        }

        const tokens = await Token.find({ where: { user: this } });

        if (amount > tokens.length) {
            return false;
        }

        const tokensToUse = tokens.slice(0, amount);
        await Token.remove(tokensToUse);

        return true;
    }
}
