<template>
  <v-content id="map-content-wrapper">
    <Sidebar v-if="$route && $route.name === 'map'" />
    <Viewer />
    <MapIcons />
    <Toolbar />
    <Zoom />
    <BubblePopupsWrapper />
    <SvgPopupWrapper />
    <RouteNavPoints />
  </v-content>
</template>

<script>
import Toolbar from './Toolbar'
import BubblePopupsWrapper from './BubblePopupsWrapper'
import Sidebar from './Sidebar'
import Zoom from './Zoom'
import Viewer from './Viewer.vue'
import MapIcons from './MapIcons'
import SvgPopupWrapper from './SvgPopupWrapper.vue'
import RouteNavPoints from './RouteNavPoints'

export default {
  name: 'Content',
  components: {
    RouteNavPoints,
    Toolbar,
    BubblePopupsWrapper,
    Zoom,
    Sidebar,
    Viewer,
    MapIcons,
    SvgPopupWrapper
  }
}
</script>

<style lang="scss" scoped>
#map-content-wrapper { overflow:hidden }
</style>
