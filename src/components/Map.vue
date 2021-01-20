<template>
  <div
    class="container pb47 flex between-xs"
    data-page-loaded="map"
  >
    <div id="map-container" />
    <route-description v-if="isRouteDescription" />
    <secondary-banner v-else />
  </div>
</template>

<script>
//theme/components/theme/blocks/Map/RouteDescription.vue
// theme/components/theme/blocks/banners/SecondaryBanner.vue
//theme/mixins/Map/insertMap.js
import RouteDescription from '../themes/Map/RouteDescription'
import SecondaryBanner from '../themes/banners/SecondaryBanner'
import { mapState, mapActions } from 'vuex'
import insertMap from '../mixins/Map/insertMap'

export default {
  name: 'Map',
  components: {
    SecondaryBanner,
    RouteDescription
  },
  mixins: [insertMap],
  computed: {
    ...mapState({
      isRouteDescription: state => state.map.isRouteDescription
    })
  }
}
</script>
