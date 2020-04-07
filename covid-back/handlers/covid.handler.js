const CustomError = require('../utilities/customError');

async function getCovidData(req, resp){
   return globalData.world;
}


async function getCountryData(req, resp){
   return globalData.countries;
}


async function getHistoryData(req, resp){
   return new CustomError(404, "Feature not implemented yet")
}


module.exports = {
    getCovidData,
    getCountryData,
    getHistoryData
}