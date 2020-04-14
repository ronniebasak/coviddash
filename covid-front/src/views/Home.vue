<template>
  <div class="home">
    <div class="map" @keyup.esc="resetView = true; viewZoom = false"> 
      <button class="restore"  :class="{inactive: !viewZoom}" @click="resetView=true; viewZoom = false">X</button>
      <WorldMap @viewReset="resetView = false" :resetView="resetView" :countryData="countryWiseCounter" @selectedCountry="selectCountry" @clickedCountry="viewZoom=true"/>
    </div>
    <div class="sidebar">
      <Card :title="thisCountry.country" titleColor="turquoise">
        <div class="row">
          <span class="title">Total cases</span>
          <span class="nottitle">
            <span class="informatic">{{thisCountry.cases}}</span>
            <span class="delta">[+{{thisCountry.todayCases}}]</span>
          </span>
        </div> 
        <div class="row">
          <span class="title">Active</span>
          <span class="informatic">{{thisCountry.active}}</span>
          <span class="delta">[{{thisCountry.critical}} critical]</span>
        </div> 
        <div class="row">
          <span class="title">Recovered</span>
          <span class="informatic">{{thisCountry.recovered }}</span>
          <span class="delta sub">[{{Math.round(thisCountry.recovered/thisCountry.cases * 10000)/100}} %]</span>
        </div> 
        <div class="row">
          <span class="title">Deceased</span>
          <span class="informatic">{{thisCountry.deaths}}</span>
          <span class="delta">[+ {{thisCountry.todayDeaths}}]</span>
          <span class="delta sub">[{{Math.round(thisCountry.deaths/thisCountry.cases * 10000)/100}} %]</span>
        </div> 
        <div class="row">
          <span class="title">Tests</span>
          <span class="informatic">{{processKMB(thisCountry.tests)}}</span>
          <span class="delta">[{{processTests(thisCountry.testsPerOneMillion)}}]</span>
        </div> 
      </Card>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import WorldMap from '../components/world.vue';
import urls from '../assets/urls.json';
import {mapCountriesData, pullCountryData} from '../modules/misc'
import Card from '../components/Card';



export default {
  name: 'Home',
  components: {
    WorldMap,
    Card
  },
  data() {
    return {
      resetView: false,
      globalCounter: {},
      countryWiseCounter: {},
      thisCountry: {},
      viewZoom: false,
    }
  },
  methods: {
    async handleCountryData(){
      let data = await pullCountryData();
      this.countryWiseCounter = data;
    },
    selectCountry(country){
      this.thisCountry = {...country};
    },    
    processKMB(data){
      if(data < 1e3){
        return data
      } else if (data >= 1e3 && data < 1e6){
        return `${Math.round(data/1e1)/1e2} K`
      } else if(data >= 1e6 && data < 1e9){
        return `${Math.round(data/1e4)/1e2} M`
      }
    },

    processTests(data){
      if(data < 1000){
        return `${data} ppm`
      } else {
        return `${Math.round(data/100)/10} %`
      }
    }
    
  },
  mounted(){
    this.handleCountryData();
  }
}
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: row;
  height: 100%;
.map {
  width: 74.101%;
  height: 100%;
}

.sidebar {
  width: calc(100% - 74.101% - 30px);
  padding: 0 15px;
  padding-top: 15px;
}

button.restore {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 48px;
  height: 48px;
  background: white;
  border: 5px solid #6649e7;
  border-radius: 32px;
  display: flex;
  align-content: center;
  justify-content: center;
  font-family: poppins;
  transition: all 0.3s ease-in-out;
}
button.restore.inactive {
  transform: rotate(180deg) scale(0.3);
  opacity: 0;
  visibility: hidden;
}


.row {
  font-family: 'poppins';
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: space-between;

  .title {
    width: 50%;
    font-weight: bold;
  }


  .informatic {
    color: red;
    font-size: 1.2em;
    margin-right: 15px;
  }

  .delta {
    color: purple;
    font-size: 0.8em;
    margin-right: 5px;
  }

  .delta.sub {
    color: grey;
  }
}
}

</style>