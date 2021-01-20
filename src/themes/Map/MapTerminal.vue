<template>
  <div
    id="map"
    class="map-terminal relative brdr-r-25 bg-cl-mad-blue"
  >
    <v-app
      id="vapp"
      class="brdr-r-25"
    >
      <Content />
    </v-app>
  </div>
</template>

<script>
import Content from './components/Content.vue'
import { mapState } from 'vuex'

export default {
  name: 'Map',
  components: {
    Content
  },
  props: {
    routeTo: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    ...mapState({
      isMapLoaded: state => state.map.isMapLoaded,
      mapviewer: state => state.visioglobe.mapviewer
    })
  }
}
</script>

<style lang="scss" scoped>
.map-terminal { max-width: 1122px; }
</style>
