import Bundler from 'parcel-bundler';
import express from 'express';
import proxy from 'http-proxy-middleware';

const app = express();

const bundler = new Bundler('src/index.html', {
    hmrPort: 3001
});

// Let express use the bundler middleware, this will let Parcel handle every request over your express server
app.use(
    '/api',
    proxy({
        target: 'http://backend:4000',
        changeOrigin: true,
    }),
);
app.use(bundler.middleware());

app.listen(3000, () => {
    console.log('Server started on port 3000.');
});
