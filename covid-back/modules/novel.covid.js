const axios = require('axios');
const CustomError = require('../utilities/customError');
const urls = {
    base: "https://corona.lmao.ninja"
}
urls.getAllCountries = `${urls.base}/countries?sort=country`;
urls.getGlobalData = `${urls.base}/all`
urls.getForCountry = country => `${urls.base}/countries/${country}`
urls.getHistoricalData = `${urls.base}/v2/historical`



async function getGlobalData(){
    var options = {
        'method': 'GET',
        'url': urls.getGlobalData,
        'headers': {
        }
    };

    try {
        let data = await axios(options);
        return data.data
    } catch(err){
        console.log("Upstream is down -- GlobalData", err);
        throw new CustomError(500, "Upstream Down")
    }
}


async function getAllCountries(){
    var options = {
        method: 'GET',
        url: urls.getAllCountries,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        timeout: 30000
    };

    try {
        let data = await axios(options);
        return data.data
    } catch(err){
        console.log("Upstream is down -- GetAllCountries", err);
        throw new CustomError(500, "Upstream Down")
    }
}


async function getForCountry(countryName){
    var options = {
        'method': 'GET',
        'url': urls.getForCountry(countryName),
        'headers': {
          'Cookie': '__cfduid=db2afb5fe5a7948ce997fa09cea57198e1585408995'
        }
      };

      try {
        let data = await axios(options);
        return data.data;
      } catch(err){
          console.log("Upstream is down or country not found -- GetForCountry", err);
          throw new CustomError(500, "Upstream Down");
      }
}


async function getHistoricalData(){
    var options = {
        'method': 'GET',
        'url': urls.getHistoricalData
    };

    try {
        let data = await axios(options);
        return data.data
    } catch(err){
        console.log("Upstream is down -- GetHistoricalData", err);
        throw new CustomError(500, "Upstream Down")
    }
}


module.exports = {
    getAllCountries,
    getForCountry,
    getGlobalData,
    getHistoricalData
}


// getForCountry('india')
// .then(data => console.log(data))