import axios from 'axios';
import urls from '../assets/urls.json';
const urlConf = urls[process.env.NODE_ENV];


export function mapCountriesData(inputAPIData){
    let returnData = {};
    for(let countries of inputAPIData){
        returnData[countries.countryInfo.iso2] = countries
    }
    return returnData
}


export async function pullCountryData(){
    let resp = await axios.get(urlConf.countriesData);
    return mapCountriesData(resp.data);
}