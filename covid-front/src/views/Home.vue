<template>
  <div class="home">
    <div class="map"> 
      <WorldMap @viewReset="resetView = false" :resetView="resetView"/>
    </div>
    <div class="sidebar">
      <button @click="resetView = true">ASJD</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import WorldMap from '../components/world.vue';
import urls from '../assets/urls.json';
import {mapCountriesData, pullCountryData} from '../modules/misc'



export default {
  name: 'Home',
  components: {
    WorldMap
  },
  data() {
    return {
      resetView: false,
      globalCounter: {},
      countryWiseCounter: {}
    }
  },
  methods: {
    async handleCountryData(){
      let data = await pullCountryData();
      console.log(data)
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
  width: 75%;
  height: 100%;
}

.sidebar {
  width: 25%;
}
}

</style>