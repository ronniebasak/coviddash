globalData = {} // since global data is less 
'use strict';
const port = 44001;
const crontab = require('./jobs/cron')
const fastify = require('fastify')({
    logger: true
})

const cors = require('cors');
fastify.use(cors());

fastify.register(require('./routes/covid.routes'))

fastify.setNotFoundHandler((request, reply) => {
    reply.code(403).type('application/json').send({
        status: 404,
        message: "Requested Route not found"
    })
})


fastify.listen(port, "localhost", function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Environment is:' ${process.env.NODE_ENV}`);
    fastify.log.info(`server listening on ${address}`);
    fastify.log.info(`Browse your REST API at %s%s ${address}/explorer`);
})