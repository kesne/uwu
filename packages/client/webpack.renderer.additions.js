module.exports = config => {
    config.resolve.extensions.unshift('.mjs');
    config.resolve.extensions.push('.svelte');
    config.module.rules.push({
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: 'svelte-loader',
    });

    return config;
};
