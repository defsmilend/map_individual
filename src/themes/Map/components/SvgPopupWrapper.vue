<template>
  <div v-show="false">
    <div v-if="activePois && activePois.length">
      <template v-for="(poi, index) in activePois">
        <svg-popup
          :key="index"
          :poi="poi"
        />
      </template>
    </div>
    <div v-if="isSinglePoi">
      <svg-popup
        :poi="activePoi"
        :is-active="true"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SvgPopup from './svgPopup.vue'
export default {
  name: 'SvgPopupWrapper',
  components: {
    SvgPopup
  },
  computed: {
    ...mapState({
      activePois: state => state.visioglobe.places.activePois,
      activePoi: state => state.visioglobe.places.activePoi,
      svgPois: state => state.visioglobe.places.svgPois
    }),
    isSinglePoi () {
      return this.activePoi && this.activePois && !this.activePois.length
    }
  }
}
</script>
