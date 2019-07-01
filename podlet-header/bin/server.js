'use strict';

const fastifyStatic = require('fastify-static');
const FastifyPodlet = require('@podium/fastify-podlet');
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
});

app.register(FastifyPodlet, podlet);

app.register(fastifyStatic, {
    root: path.join(__dirname, '../public/css/'),
});

app.get(podlet.content(), async (request, reply) => {
    reply.podiumSend(html.header());
});

app.get(podlet.manifest(), async (request, reply) => {
    reply.send(podlet);
});

app.get(podlet.css({ value: '/public/css/main.css' }), (request, reply) => {
    reply.sendFile('main.css');
});

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
