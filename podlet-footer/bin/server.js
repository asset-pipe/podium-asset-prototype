'use strict';

const HapiPodlet = require('@podium/hapi-podlet');
const Podlet = require('@podium/podlet');
const inert = require('@hapi/inert');
const Hapi = require('hapi');
const html = require('./html');

const path = require('path');
const filePath = path.join(__dirname, '../public/css/main.css');

const app = Hapi.Server({
    host: 'localhost',
    port: 7200,
});

const podlet = new Podlet({
    pathname: '/',
    version: `2.0.0-${Date.now().toString()}`,
    logger: console,
    name: 'footer',
});

app.register({
    plugin: new HapiPodlet(),
    options: podlet,
});

app.register(inert);

app.route({
    method: 'GET',
    path: podlet.content(),
    handler: (request, h) => {
        return h.podiumSend(html.footer());
    },
});

app.route({
    method: 'GET',
    path: podlet.manifest(),
    handler: (request, h) => JSON.stringify(podlet),
});

app.route({
    method: 'GET',
    path: podlet.css({ value: '/public/css/main.css' }),
    handler: async (request, h) => {
        return h.file(filePath);
    },
});

// podlet.css({ value: '/public/css/main.css' });

async function start() {
    try {
        await app.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', app.info.uri);
}
setTimeout(() => {
    start();
}, 1000);
