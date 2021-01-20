<template>
  <div
    v-if="isShowCounters"
    class="points-counter bg-cl-cornflower-blue cl-white weight-700 fs16 lh16 absolute brdr-r-25 pt5 border-box"
  >
    {{ count }}
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'PointsCounter',
  props: {
    floor: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters('visioglobe/places', ['activeMapPointsByFloors']),
    ...mapState('visioglobe/places', ['activePlaces', 'activePois']),
    count () {
      return this.activeMapPointsByFloors[this.floor].length
    },
    isShowCounters () {
      return (this.activePlaces.length + this.activePois.length) > 1
    }
  }
}
</script>

<style lang="scss" scoped>
.points-counter {
  min-width: 43px;
  min-height: 26px;
  top: -5px;
  left: -30px;
}
</style>
