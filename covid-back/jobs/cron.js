var CronJob = require('cron').CronJob;
const novelCovidAPI = require('../modules/novel.covid');


async function handleCron() { // run every 30 seconds
  // update global number
  console.log("Updating Database", Date.now());
  let worldInfoPromise = novelCovidAPI.getGlobalData();
  let countryInfoPromise = novelCovidAPI.getAllCountries();
  let worldInfo, countryInfo;
  
  try {
    worldInfo = await worldInfoPromise;
    countryInfo = await countryInfoPromise;
  } catch(err){
    console.log("Could not update")
  }

  // update RAM
  globalData.world = worldInfo || globalData.world;
  globalData.countries = countryInfoPromise || globalData.countries;
}



var job = new CronJob('*/30 * * * * *', handleCron, null, true);
job.start();

module.exports = {
  handleCron
}