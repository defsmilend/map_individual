<template>
  <div
    id="container"
    ref="viewer"
    class="relative"
  />
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import RestaurantsAndCafesMallObjectsComparerByDistance from 'theme/mixins/RestaurantsAndCafesMallObjectsComparerByDistance'

export default {
  name: 'Viewer',
  mixins: [RestaurantsAndCafesMallObjectsComparerByDistance],
  data () {
    return {
      resizeCallback: null
    }
  },
  computed: {
    ...mapState({
      mapviewer: ({ visioglobe }) => visioglobe.mapviewer,
      parameters: ({ visioglobe }) => visioglobe.parameters,
      globalMalls: ({ visioglobe }) => visioglobe.globalMalls,
      mallId: ({ visioglobe }) => visioglobe.mallId,
      terminalCoords: ({ terminals }) => terminals.terminalCoords,
      isRouteDescription: ({ map }) => map.isRouteDescription,
      isMapLoaded: ({ map }) => map.isMapLoaded,
      mallInfoPromise: ({ main }) => main.mallInfoPromise,
      mainMallId: ({ main }) => main.mall.id,
      terminalId: ({ terminals }) => terminals.terminal.id,
      visioglobeId: ({ terminals }) => terminals.terminal.visioglobe_id,
      allCategories: ({ categories }) => categories.categories,
      activePoi: state => state.visioglobe.places.activePoi
    }),
    mainTerminalDataLoaded () {
      return this.mainMallId && this.terminalId && this.visioglobeId && this.allCategories.length
    }
  },
  mounted () {
    const terminalDataCheckInterval = setInterval(() => {
      if (this.isMapLoaded) {
        clearInterval(terminalDataCheckInterval)
      }
      if (this.$route.name !== 'error' && !this.isMapLoaded && this.mainTerminalDataLoaded) {
        clearInterval(terminalDataCheckInterval)
        this.mallInfoPromise.then(this.renderMap())
      }
    }, 2000)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.resizeCallback)
  },
  methods: {
    ...mapMutations('visioglobe', ['setParameters']),
    ...mapActions({
      setMapIsLoaded: 'map/setMapIsLoaded',
      setMapLoadingPromise: 'map/setMapLoadingPromise',
      setTerminalPOI: 'terminals/setTerminalPOI',
      createMapviewer: 'visioglobe/createMapviewer',
      initMapviewer: 'visioglobe/initMapviewer',
      onResize: 'visioglobe/onResize'
    }),
    initialize () {
      this.$vuetify.theme.primary = this.parameters.ui.colors.primary
      return this.initMapviewer()
        .then(() => {
          this.resizeCallback = this.onResize.bind(this)
          window.addEventListener('resize', this.resizeCallback)
          this.setMapIsLoaded(true)
        })
        .catch(e => { throw Error(e) })
    },
    renderMap () {
      const viewer = this.$refs.viewer
      this.createMapviewer({ element: viewer })
      const mapLoadingPromise = this.initialize()
      this.setMapLoadingPromise(mapLoadingPromise)
      this.mapLoadingCompleted()
    },
    mapLoadingCompleted () {
      let timerID = 0
      this.mapviewer.on('redraw', ev => {
        clearInterval(timerID)
        timerID = setTimeout(() => {
          this.mapviewer.off('redraw')
          console.info('------- Map loaded -------')
          this.compareRestaurantsAndCafesMallObjectsByDistance()
          clearInterval(timerID)
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$red: color(red);
#container {
  flex: 1;
  width: 1122px;
  height: 677px;
}

#container /deep/ {
  canvas {
    border-radius: 20px;
  }
  .route_floorChange  {
    p {
      display: none;
    }
    img {
      width: 32px;
      height: 32px;
      position: absolute;
    }
  }
}
</style>
