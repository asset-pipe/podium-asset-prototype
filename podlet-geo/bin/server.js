'use strict';

const express = require('express');
const Podlet = require('@podium/podlet');
const html = require('./html');

const app = express();

const podlet = new Podlet({
    pathname: '/',
    version: `2.0.0-${Date.now().toString()}`,
    logger: console,
    name: 'geo',
    development: true,
});

app.use(podlet.middleware());

app.use((req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get(podlet.content(), (req, res) => {
    res.podiumSend(html.map());
});

app.get(podlet.manifest(), (req, res) => {
    res.json(podlet);
});

app.use('/public', express.static('public', {
    etag: false
}));
podlet.css({ value: '/public/css/main.css' });
podlet.js({ value: '/public/js/esm/assets/js/main.js', type: 'module' });

app.listen(7400, () => {
    console.log(`http://localhost:7400`);
});
