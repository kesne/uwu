module.exports = (config) => {
    config.resolve.extensions.unshift('.mjs');
    config.resolve.extensions.push('.svelte');
    config.module.rules.push({
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: 'svelte-loader',
    });

    config.module.rules.find((rule) => {
        if (rule && rule.test && rule.test.test('.css')) {
            rule.use = ['style-loader', 'postcss-loader'];
        }
    });

    return config;
};
