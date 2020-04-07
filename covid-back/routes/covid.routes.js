const covidHandler = require('../handlers/covid.handler');
const schema = require('../config/schema.json')
const CustomError = require('../utilities/customError');

async function routes(fastify, options) {
    fastify.get(schema.covid19dash.global.schema.url, schema.covid19dash.global.schema, covidHandler.getCovidData);
    fastify.get(schema.covid19dash.countries.schema.url, schema.covid19dash.countries.schema, covidHandler.getCountryData);
    fastify.get(schema.covid19dash.history.schema.url, schema.covid19dash.history.schema, covidHandler.getHistoryData);


    fastify.addHook("onSend", async function (req, reply, payload) {
        console.log("Response hook: > ");
        // this interceptors checks if a response is an instace of our custom Error, then sets according 

        try {
            // console.log("Incoming Payload", payload)
            let newPayload = JSON.parse(payload); // payload comes as stringified

            if(newPayload.error && newPayload){
                // console.log(newPayload.error.error)
                reply.code(+newPayload.error.error.status);
                return JSON.stringify(newPayload.error);
            } else {
                return payload;
            }
        } catch (err) {
            console.log("Error in Hook")
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
