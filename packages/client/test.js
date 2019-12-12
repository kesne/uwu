const axios = require('axios');

const MORPH = 'https://api.lifx.com/v1/lights/all/effects/morph';

axios
    .post(
        MORPH,
        {
            power_on: true,
            // palette: ["#9542f5", "#1084e3", "#00f2ff", "#d000ff"],
            period: 10
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.LIFX_API_TOKEN}`,
            },
        },
    )
    .then(console.log, console.error);
