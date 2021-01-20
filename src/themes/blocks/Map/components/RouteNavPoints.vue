<template>
  <div
    v-show="false"
  >
    <div
      v-for="(point, i) in navPointsCount"
      :id="'navPoint' + i"
      :key="i"
      @click="pickRouteDetail(i)"
      @touchend="pickRouteDetail(i)"
    >
      <div
        :class="{ pointContainer: i !== 0 }"
      >
        <div class="point" />
        <div
          v-if="selectedNavPoint === i"
          class="selectedPoint"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RouteDetails from 'theme/mixins/RouteDetails/index.js'

export default {
  name: 'RouteNavPoints',
  mixins: [RouteDetails],
  computed: {
    ...mapState('visioglobe/route', ['navPointsCount', 'selectedNavPoint'])
  },
  methods: {
    // pickRouteDetail (num) {
    //   this.$store.dispatch('visioglobe/route/selectNavPoint', num)
    //   const nearPlace = this.allInstructions[num].nearPlace.id
    //   if (nearPlace) console.log(nearPlace)
    // },
    pickRouteDetail (num) {
      let nearPlace
      this.$store.dispatch('visioglobe/route/selectNavPoint', num - 1)
      if (this.allInstructions[num - 1].nearPlace) {
        nearPlace = this.allInstructions[num - 1].nearPlace.id
      }
      if (nearPlace) {
        const onlyClearPlace = this.destination.nearPlace.id === nearPlace
        this.$store.dispatch('visioglobe/route/showNearPlace', { nearPlace, onlyClearPlace })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$red: color(red);

 .pointContainer {
   position: relative;
   background: white;
   width: 24px;
   height: 24px;
   border: 1px solid gray;
   border-radius: 50%;
   z-index: 2;
   .point {
     position: absolute;
     top: 25%;
     left: 25%;
     width: 12px;
     height: 12px;
     border: none;
     z-index: 2;
     background: #D15E61;
     border-radius: 50%;
   }
   .selectedPoint {
     position: absolute;
     background: #D15E61;
     mix-blend-mode: color;
     opacity: 0.5;
     top: -65%;
     left: -65%;
     border-radius: 100%;
     width: 55px;
     height: 55px;
     -webkit-animation: pulsing 1s infinite;
     animation: pulsing 1s infinite;
   }
   @keyframes pulsing {
     0% {
       transform: scale(0.5, 0.5);
       opacity: 0;
     }
     50% {
       opacity: 0.5;
     }
     75% {
       transform: scale(1.0, 1.0);
     }
     100% {
       opacity: 0;
     }
   }
 }
</style>
