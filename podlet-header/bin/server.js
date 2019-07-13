'use strict';

const FastifyPodlet = require('@podium/fastify-podlet');
const fastifyStatic = require('fastify-static');
const fastifyCors = require('fastify-cors');
const fastify = require('fastify');
const Podlet = require('@podium/podlet');
const html = require('./html');
const path = require('path');

const app = fastify({ logger: true })

const podlet = new Podlet({
    pathname: '/',
    version: `2.0.0-${Date.now().toString()}`,
    logger: console,
    name: 'header',
    development: true,
});

app.register(fastifyCors, {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
  origin: '*',
});

app.register(FastifyPodlet, podlet);

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public/'),
});

app.get(podlet.content(), async (request, reply) => {
    reply.podiumSend(html.header());
});

app.get(podlet.manifest(), async (request, reply) => {
    reply.send(podlet);
});

podlet.css({ value: '/css/main.css' })
podlet.js({ value: '/js/bundle.esm.min.js', type: 'esm' })


// Run the server!
const start = async () => {
  try {
    await app.listen(7100)
    app.log.info(`server listening on ${app.server.address().port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()
