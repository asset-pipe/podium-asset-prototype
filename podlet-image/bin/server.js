'use strict';

const compression = require('compression');
const express = require('express');
const Podlet = require('@podium/podlet');
const html = require('./html');

const app = express();
app.use(compression());

const podlet = new Podlet({
    pathname: '/',
    version: `2.0.0-${Date.now().toString()}`,
    logger: console,
    name: 'image',
    development: true,
});

app.use((req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
    res.podiumSend(html.upload());
    // res.podiumSend(html.test());
});

app.get(podlet.manifest(), (req, res) => {
    res.json(podlet);
});

app.use('/public', express.static('public', {
    etag: false
}));

podlet.css({ value: '/public/css/main.css' });

podlet.js({ value: 'https://cdn.pika.dev/lit-element/v2', type: 'esm' });
podlet.js({ value: '/public/js/bundle.esm.min.js', type: 'esm' });

app.listen(7500, () => {
    console.log(`http://localhost:7500`);
});
