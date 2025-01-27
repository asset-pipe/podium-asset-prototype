'use strict';

const compression = require('compression');
const express = require('express');
const Podlet = require('@podium/podlet');
const html = require('./html');

const app = express();
app.use(compression());

const podlet = new Podlet({
    pathname: '/',
    fallback: '/fallback',
    version: `2.0.0-${Date.now().toString()}`,
    logger: console,
    name: 'auth',
    development: true,
});
/*
podlet.defaults({
    locale: 'no-NB'
});
*/
app.use(podlet.middleware());

app.use((req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get(podlet.content(), (req, res) => {
    res.podiumSend(html.auth(res.locals.podium.context.locale));
});

app.get(podlet.fallback(), (req, res) => {
    res.podiumSend(html.fallback());
});

app.get(podlet.manifest(), (req, res) => {
    res.json(podlet);
});

app.use('/public', express.static('public', {
    etag: false
}));
podlet.css({ value: '/public/css/main.css' });
// podlet.js({ value: '/public/js/esm/assets/js/main.js', type: 'esm' });
podlet.js({ value: 'https://cdn.pika.dev/wired-elements/v1', type: 'esm' });
podlet.js({ value: '/public/js/bundle.esm.min.js', type: 'esm' });

app.listen(7300, () => {
    console.log(`http://localhost:7300`);
});
