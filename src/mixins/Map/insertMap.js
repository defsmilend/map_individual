import {mapState, mapActions, mapMutations} from 'vuex'

export default {
  beforeRouteLeave (to, from, next) {
    if (this.isMapInserted) {
      try {
        this.extractMap()
      } catch (err) {
        throw Error(err)
      } finally {
        next()
        this.goToDefaultView()
      }
    } else {
      next()
    }
  },
  mounted () {
    this.insertMap()
    if (this.isMapLoaded) this.setColorsForAnchors({ isInitialColor: true })
  },
  computed: {
    ...mapState({
      defaultViewpointPosition: state => state.config.visioglobe.defaultViewpointPosition,
      isMapInserted: ({ map }) => map.isMapInserted,
      mapLoadingPromise: ({ map }) => map.mapLoadingPromise,
      isMapLoaded: ({ map }) => map.isMapLoaded
    })
  },
  beforeDestroy () {
    this.cleanDiscountAnchorTenants()
  },
  methods: {
    ...mapActions({
      extractMap: 'map/extractMap',
      insertMap: 'map/insertMap',
      setActiveMapPoint: 'map/setActiveMapPoint',
      goToDefaultView: 'visioglobe/goToDefaultView',
      setInitialStateOfMap: 'visioglobe/setInitialStateOfMap',
      setColorsForAnchors: 'visioglobe/places/setColorsForAnchors'
    }),
    ...mapMutations({
      cleanDiscountAnchorTenants: 'visioglobe/places/cleanDiscountAnchorTenants'
    }),
    async setRouteToCurrentObject (visioglobe_id) {
      try {
        await this.mapLoadingPromise
        await this.setInitialStateOfMap()
        this.setActiveMapPoint({ visioglobe_id, isDisplayRoute: true })
      } catch (err) {
        console.log(err)
        this.goToDefaultView()
      }
    },
    isActiveMap () {
      if (!this.isMapInserted) {
        this.$nextTick(this.insertMap)
      }
    }
  }
}
