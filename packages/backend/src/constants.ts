export const PORT = process.env.PORT || 4000;
export const TWITCH_NAME = 'VapeJuiceJordan';
export const TWITCH_ID = '452849164';
export const TWITCH_BOT_NAME = 'VapeJuiceJorbot'
export const VJJ_ACCESS_TOKEN = 'vjj:access_token';
export const VJJ_REFRESH_TOKEN = 'vjj:refresh_token';
export const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID as string;
export const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET as string;
export const SESSION_SECRET = process.env.SESSION_SECRET || 'cfeb562100a151171044c5e3a10ef8793edb790a821c5f7fe6a7b1dcf0039f28';
export const WEBSOCKET_SECRET = process.env.WEBSOCKET_SECRET || '5875926bee61d3280dbcdb9d2a1ddbbd';

// TODO : Move this to UWU and just make the backend a passthrough so that there's only one place to implement redemption logic.
// TODO : ONLY PROBLEM: That we have redemptions that ARE backend only, such as the points-to-token redemption.
export const REWARDS = {
    '25f5a630-15ef-4161-89da-b6790dbd7ad5': 'TTS',
    'a3174f83-62ff-4cfb-b156-7b97175ea42f': 'CAT_CAM',
    '4adb7318-da35-485a-b118-d8080197233a': 'SET_LIGHTS'
} as Record<string, string>;
