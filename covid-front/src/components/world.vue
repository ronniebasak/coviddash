<template>
<!-- <?xml version="1.0" encoding="UTF-8" standalone="no"?> -->
<!-- Created for MapSVG plugin: http://mapsvg.com -->
<div>
   <svg
      xmlns="http://www.w3.org/2000/svg"
      mapsvg:geoViewBox="-169.110266 83.600842 190.486279 -58.508473"
      :viewBox="cViewBox"
   >

      <path v-for="country in world.filter(c => !c.inactive)" :key="country.countryCode" 
         :d="country.path"
         :title="country.countryName"
         :id="country.countryCode"
         @click="zoomTo"
         class="path-class"
         @mousemove="showToolTip"
         @mouseleave="hideToolTip"
         :style="{
            fill: country.color
         }"
         :class="{
            active: country.active,
            inactive: country.inactive
         }"
      />
   
   </svg>

   <div :style="{
      position: 'absolute',
      background: 'black',
      display: '  block',
      left: tooltip.x +'px',
      top: tooltip.y + 'px',
      transition: '0.1s ease-in-out',
      opacity: tooltip.display,
      visibility: tooltip.display ? 'visible': 'hidden',
      padding: '5px',
      color: 'lavender',
      fontFamily: 'poppins',
      fontSize: 'smaller',
      textAlign: 'left'
   }">
      Country: {{tooltip.countryName}} <br/>
      Total: {{tooltip.total}} <br/>
      Active: {{tooltip.active}} <br/>
      Deceased: {{tooltip.dead}} <br/>
   </div>
</div>

</template>

<script>
import WorldJSON from '../assets/worldmap.json';
const createjs = window.createjs;
createjs.Ticker.timingMode = createjs.Ticker.RAF;

export default {
   name: 'WorldMap',
   props: ["resetView", "countryData"],
   data: () => {
      return {
         world: [...WorldJSON.map(c => {return {...c, active: false, inactive: false, color: 'initial'}})],
         ogViewBox: "0 0 1009.6727 665.96301",
         cViewBox: "0 0 1009.6727 665.96301",
         aspect: 1009.6727/665.96301,

         tooltip: {
            x: 110,
            y: 110,
            display: 1,
            countryName: "",
            total: 0,
            active: 0,
            dead: 0
         }
      }
   },
   methods: {
      zoomTo(ev){
         console.log(ev.target.id)
         let thisCountry = undefined;
         for(let country of this.world){
            if (country.countryCode != ev.target.id){
               country.active = false;
               country.inactive = true;
            } else {
               country.active = true;
               country.inactive = false;
               thisCountry = country;
            }
         }
         let [oldX, oldY, oldW, oldH] = this.cViewBox.split(" ")
         let self = this;
         let bbox = ev.target.getBBox();


         let dst = {
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height
         };

         let dstAspect = dst.width/dst.height;
         // console.log("TARGET", this.aspect)
         // console.log("OLD AASPEC", dstAspect)
         if(dstAspect > this.aspect){ // wider than required, add height
            let targetH = dst.width/this.aspect;
            let deltaH = targetH - dst.height;
            dst.y = dst.y - (deltaH/2);
            dst.height = targetH;
         } 
         else if(dstAspect < this.aspect) { // longer than required, add width
            let targetW = this.aspect*dst.height;
            let deltaW = targetW - dst.width;
            dst.x = dst.x - (deltaW/2)
            dst.width = targetW; 
         } 

         // console.log("NEW ASP", dst.width/dst.height)

         dst = {
            ...dst
         }

         let obj = {
            x: +oldX,
            y: +oldY,
            width: +oldW,
            height: +oldH
         }
         let an = createjs.Tween.get(obj)
            .to(dst, 300, createjs.Ease.quadInOut)
            .play();

         an.addEventListener("change", () => {
            // console.log("Change")
               this.cViewBox = `${obj.x} ${obj.y} ${obj.width} ${obj.height}`
            })

         this.$emit("clickedCountry", thisCountry);
      },

      zoomOut(){
         let [oldX, oldY, oldW, oldH] = this.cViewBox.split(" ").map(parseFloat);
         let [newX, newY, newW, newH] = this.ogViewBox.split(" ").map(parseFloat);

         let dst = {
            x: newX,
            y: newY,
            width: newW,
            height: newH
         };

         let obj = {
            x: oldX,
            y: oldY,
            width: oldW,
            height: oldH
         }
         let an = createjs.Tween.get(obj)
            .to(dst, 300, createjs.Ease.quadInOut)
            .play();

         an.addEventListener("change", () => {
            // console.log("Change")
               this.cViewBox = `${obj.x} ${obj.y} ${obj.width} ${obj.height}`
            })


      for(let country of this.world){
            country.active = false;
            country.inactive = false;
         }
      },

      showToolTip(ev){
         // console.log(ev)
         this.tooltip.x = ev.clientX + 15;
         this.tooltip.y = ev.clientY +15;
         this.tooltip.display = 1;

         let thisCountry = undefined;
         let thisCC = undefined
         for(let country of this.world){
            if (country.countryCode == ev.target.id){
               thisCountry = country;
            }
         }

         this.tooltip.countryName = thisCountry.countryName
         this.tooltip.total = this.countryData[thisCountry.countryCode]?.cases;
         this.tooltip.active = this.countryData[thisCountry.countryCode]?.active;
         this.tooltip.dead = this.countryData[thisCountry.countryCode]?.deaths;
         ev.preventDefault()
         this.$emit("selectedCountry", this.countryData[thisCountry.countryCode])
      },

      hideToolTip(ev){
         this.tooltip.display = 0;
         this.$emit("unselectCountry")
      },

      findColor(countryCode){
         this.countryData[countryCode]
      }
   },
   watch: {
      resetView(val){
         if(val == true){
            this.zoomOut()
         }
         this.$emit('viewReset');
      },
      countryData(cD){
            let maxActive = 0;
            let maxTotal = 0;
            let maxDead = 0
            for (let countryCC in this.countryData){
               let country = this.countryData[countryCC]
               if(country.cases > maxTotal){
                  maxTotal = country.cases
               }
               if(country.active > maxActive){
                  maxActive = country.active;
               }
               if(country.deaths > maxDead){
                  maxDead = country.deaths;
               }
            }
            
            for(let country of this.world){
               let total = this.countryData[country.countryCode]?.cases;
               console.log(country.countryCode, "TOT", total, "MT", maxTotal)
               let v = Math.floor((Math.log(total)/Math.log(maxTotal)) * 100)
               country.color = `hsl(${(100-v)*1.2  }, ${40+v/2}%, ${Math.log(v)*11   }%)`
            }

            return 0;
         }
      }

}
</script>


<style lang="scss" scoped>
.path-class {
   transition: 0.3s ease-in-out;
   stroke: transparent;
   fill: lightblue
}

.path-class.active {
   fill: lightcoral;
}

.path-class.inactive {
   fill: #FFF;
   display: none;
}

.path-class:hover {
   stroke: turquoise;
}
</style>