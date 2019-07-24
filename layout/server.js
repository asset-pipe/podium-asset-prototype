'use strict';

const compression = require('compression');
const express = require('express');
const Layout = require('@podium/layout');

const app = express();
app.use(compression());

const layout = new Layout({
    name: 'example',
    pathname: '/',
    logger: console,
});

const header = layout.client.register({
    name: 'header',
    uri: 'http://localhost:7100/manifest.json',
    resolveCss: true,
    resolveJs: true,
});

const footer = layout.client.register({
    name: 'footer',
    uri: 'http://localhost:7200/manifest.json',
    resolveCss: true,
    resolveJs: true,
});

const auth = layout.client.register({
    name: 'auth',
    uri: 'http://localhost:7300/manifest.json',
    resolveCss: true,
    resolveJs: true,
});

const geo = layout.client.register({
    name: 'geo',
    uri: 'http://localhost:7400/manifest.json',
    resolveCss: true,
    resolveJs: true,
    throwable: false,
});

const images = layout.client.register({
    name: 'images',
    uri: 'http://localhost:7500/manifest.json',
    resolveCss: true,
    resolveJs: true,
});

app.use((req, res, next) => {
    res.locals = {
        locale: 'no-NB'
    };
    next();
});

app.use(layout.middleware());

app.get('/', async (req, res, next) => {
    const incoming = res.locals.podium;
    try {
        const podlets = await Promise.all([
            header.fetch(incoming),
            auth.fetch(incoming),
            geo.fetch(incoming),
            images.fetch(incoming),
            footer.fetch(incoming),
        ]);

        const body = `
            <div class="grid">
                <div class="span-col-2">${podlets[0].content}</div>
                <div>${podlets[1].content}</div>
                <div class="span-col-3">${podlets[2].content}</div>
                <div class="span-col-3">${podlets[3].content}</div>
                <div class="span-col-3">${podlets[4].content}</div>
            </div>
        `;

        incoming.css = incoming.css.concat(podlets.map(item => item.css).reduce((a, b) => a.concat(b), []));
        incoming.js = incoming.js.concat(podlets.map(item => item.js).reduce((a, b) => a.concat(b), []));

        incoming.view = {
            title: 'Catnip Tracker Inc.',
        };

        res.status(200).podiumSend(body);
    } catch(error) {
        next(error);
    }
});

app.use('/public', express.static('public', {
    etag: false
}));

layout.css({ value: '/public/css/main.css' });

layout.js({ value: 'https://cdn.pika.dev/wired-elements/v1', type: 'esm' });
layout.js({ value: '/public/js/bundle.esm.min.js', type: 'esm' });
layout.js({ value: '/public/cli/main.js', type: 'esm' });

app.use((error, req, res, next) => {
    res.status(500).send('Internal server error');
});

app.listen(7000);
