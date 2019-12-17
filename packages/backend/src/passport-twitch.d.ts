declare module 'passport-twitch.js' {
    import { Strategy as PassportStrategy } from 'passport';

    type Config = {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
        scope: string[];
    };

    type TwitchProfile = {
        id: string;
        login: string;
        display_name: string;
        type: string;
        broadcaster_type: string;
        description: string;
        profile_image_url: string;
        offline_image_url: string;
        view_count: number;
        email: string;
        provider: string;
    };

    type Callback = (
        accessToken: string,
        refreshToken: string,
        profile: TwitchProfile,
        done: (e?: null | Error, user?: null | unknown) => void,
    ) => void;

    export class Strategy implements PassportStrategy {
        name: string;
        constructor(config: Config, callback: Callback);
        authenticate(): any;
    }
}
