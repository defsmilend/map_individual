<template>
  <v-bottom-sheet
    v-model="enabled"
    inset
    hide-overlay
    persistent
  >
    <PlaceInfo />
  </v-bottom-sheet>
</template>

<script>
import { mapState } from 'vuex'
import PlaceInfo from './PlaceInfo'

export default {
  components: {
    PlaceInfo
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('visioglobe', ['parameters']),
    ...mapState('visioglobe/places', ['activePlace']),
    enabled: function () {
      return (this.parameters.ui.placeinfo.type === 'card' && this.activePlace !== null)
    }
  }
}
</script>

<style scoped>
  .bottom-sheet {
    height: 500;
  }
</style>
