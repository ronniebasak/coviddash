const covidHandler = require('../handlers/covid.handler');
const schema = require('../config/schema.json')
const CustomError = require('../utilities/customError');

async function routes(fastify, options) {
    fastify.get(schema.covid19dash.informatics.schema.url, schema.covid19dash.informatics.schema, covidHandler.getCovidData);


    fastify.addHook("onSend", async function (req, reply, payload) {
        console.log("Response hook: > ");
        // this interceptors checks if a response is an instace of our custom Error, then sets according 

        try {
            console.log("Incoming Payload", payload)
            let newPayload = JSON.parse(payload); // payload comes as stringified

            if(newPayload instanceof CustomError){
                reply.code(+newPayload.error.status);
                return payload;
            } else {
                return payload;
            }
        } catch (err) {
            console.log("Payload not JSON")
            console.log(payload)
            let newPayload = new CustomError(500, "Internal Server Error") // payload comes as stringified
            let toReturn = {
                error: newPayload.error
            }
            return JSON.stringify(toReturn);
        }
    })

}

module.exports = routes
