<template>
<!-- <?xml version="1.0" encoding="UTF-8" standalone="no"?> -->
<!-- Created for MapSVG plugin: http://mapsvg.com -->
<div>
   <svg
      xmlns="http://www.w3.org/2000/svg"
      mapsvg:geoViewBox="-169.110266 83.600842 190.486279 -58.508473"
      :viewBox="cViewBox"
      @wheel="handleZoom"
   >
   <g :style="{
      transition: `${worldTransformer.transition ? 'transform 0.3s ease-in-out' : 'off'}`, 
      transform: `scale(${worldTransformer.scaleFactor}) translateX(${worldTransformer.xFactor}px) translateY(${worldTransformer.yFactor}px)`,
      transformOrigin: `${worldTransformer.xPivot}px ${worldTransformer.yPivot}px`}" >
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
   </g>
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
         worldTransformer: {
            width: 1009.6727,
            height: 665.96301,
            transition: true,
            scaleFactor: 1,
            xFactor: 0,
            yFactor: 0,
            xPivot: 0,
            yPivot: 0,
         },


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
         // for(let country of this.world){
         //    if (country.countryCode != ev.target.id){
         //       country.active = false;
         //       country.inactive = true;
         //    } else {
         //       country.active = true;  
         //       country.inactive = false;
         //       thisCountry = country;
         //    }
         // }
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
         dst = {
            ...dst
         }

         let obj = {
            x: +oldX,
            y: +oldY,
            width: +oldW,
            height: +oldH
         }

         this.worldTransformer.scaleFactor = obj.height/dst.height;
         // this.worldTransformer.xPivot = -dst.x + dst.width/2;
         // this.worldTransformer.yPivot = -dst.y + dst.height/2;
         this.worldTransformer.xFactor = -dst.x - dst.width/(1009.6727/this.worldTransformer.xPivot) + this.worldTransformer.xPivot;
         this.worldTransformer.yFactor = -dst.y - dst.height/(665.96301/this.worldTransformer.yPivot) + this.worldTransformer.yPivot;

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

      this.worldTransformer.scaleFactor = 1;
      this.worldTransformer.xFactor = 0;
      this.worldTransformer.yFactor = 0;
      // this.worldTransformer.xPivot = 

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
      },

      handleZoom(ev){
         ev.preventDefault();
         this.worldTransformer.transition = false;
         
         if(ev.ctrlKey){
            this.worldTransformer.scaleFactor -= ev.deltaY * 0.01;
            this.worldTransformer.xFactor -= ev.deltaY * 0.01;
            this.worldTransformer.yFactor -= ev.deltaY * 0.01;
         } else {
            if(ev.shiftKey && ev.deltaX==0){
               this.worldTransformer.xFactor -= ev.deltaY/this.worldTransformer.scaleFactor
               this.worldTransformer.yFactor -= 0;
            } else {
               this.worldTransformer.xFactor -= ev.deltaX/this.worldTransformer.scaleFactor;
               this.worldTransformer.yFactor -= ev.deltaY/this.worldTransformer.scaleFactor;
            }
   
         }       
         if(this.worldTransformer.scaleFactor < 1){
            this.worldTransformer.scaleFactor = 1;
         }

         let self=this;
         this.$nextTick(function(){
            self.worldTransformer.transition = true
         })
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
               country.color = `hsl(${(100-v)*1.5  }, ${33+v/1.5}%, ${ Math.log(v) * 10}%)`
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
   fill: lightblue;
   // stroke: white;
}

.path-class.active {
   fill: lightcoral;
}

.path-class.inactive {
   fill: #FFF;
   display: none;
}

// .path-class:hover {
//    fill: grey  !important;
// }
</style>