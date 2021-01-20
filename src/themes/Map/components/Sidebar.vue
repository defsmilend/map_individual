<template>
  <div
    v-show="showSidebar"
    class="sidebar brdr-r-5 absolute bg-cl-white-smoke2"
  >
    <template v-if="sidebarServices && sidebarServices.length">
      <div
        v-for="({ codeTab, mapPoints } = {}) in sidebarServices"
        :key="codeTab"
        :class="{ active: activeTabSidebar === codeTab }"
        class="sidebar-item brdr-r-5 m10 bg-cl-white flex middle-xs start-xs column relative"
        :data-submenu-button="'Таб на карте: ' + codeTab"
        @click="setActiveSidebarItem(codeTab)"
      >
        <component
          :is="`svg-${getImageByCode(codeTab)}`"
          class="img-wrapper mt30"
        />
        <p class="title fs12 lh16 weight-700 cl-black align-center w-100 uppercase">
          {{ $t(codeTab) }}
        </p>
        <div
          class="count absolute fs12 lh16 weight-700"
        >
          {{ mapPoints.length }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { SvgBlackAtms, SvgBlackDiscounts, SvgBlackToilets, SvgBlackServices, SvgWhiteAtms, SvgWhiteDiscounts, SvgWhiteToilets, SvgWhiteServices } from 'theme/assets/svg'

export default {
  name: 'Sidebar',
  components: {
    SvgBlackAtms,
    SvgBlackDiscounts,
    SvgBlackToilets,
    SvgBlackServices,
    SvgWhiteAtms,
    SvgWhiteDiscounts,
    SvgWhiteToilets,
    SvgWhiteServices
  },
  computed: {
    ...mapGetters('map', ['sidebar']),
    ...mapState({
      activeTabSidebar: state => state.visioglobe.places.activeTabSidebar,
      activePoi: state => state.visioglobe.places.activePoi,
      sidebarServices: ({ map }) => map.sidebarServices,
      isRouteDescription: ({ map }) => map.isRouteDescription,
      mapviewer: ({ visioglobe }) => visioglobe.mapviewer
    }),
    cleanPoints () {
      // получаем текущии пои карты
      const cleanPoints = []
      const { mapPoints } = this.sidebarServices.find(el => el.codeTab === this.activeTabSidebar)
      if (mapPoints && mapPoints.length) {
        mapPoints.forEach((point) => {
          const groupPoints = this.mapviewer.getPOI(point.visioglobe_id)
          if (Array.isArray(groupPoints)) {
            cleanPoints.push(groupPoints)
          }
        })
      }
      return cleanPoints
    },
    showSidebar () {
      if (this.$route.name === 'map') {
        return true
      } else {
        return false
      }
    }
  },
  beforeDestroy () {
    this.setServices({})
    this.setActiveTabSidebarMap('')
  },
  methods: {
    ...mapActions({
      setInitialStateOfMap: 'visioglobe/setInitialStateOfMap',
      paintPlace: 'visioglobe/places/paintPlace',
      getPlaces: 'visioglobe/places/getPlaces',
      setColorsForAnchors: 'visioglobe/places/setColorsForAnchors',
      resetActivePlace: 'visioglobe/places/resetActivePlace',
      resetActivePois: 'visioglobe/places/resetActivePois',
      resetActivePoi: 'visioglobe/places/resetActivePoi',
      setActiveTabSidebarMap: 'visioglobe/places/setActiveTabSidebarMap',
      getNearestPoint: 'visioglobe/route/getNearestPoint',
      setToPoi: 'visioglobe/route/setToPoi',
      setTo: 'visioglobe/route/setTo',
      goToDefaultView: 'visioglobe/goToDefaultView',
      setActiveMapPoint: 'map/setActiveMapPoint',
      setServices: 'map/setServices',
      showRouteDescription: 'map/showRouteDescription'
    }),
    ...mapMutations({
      cleanDiscountAnchorTenants: 'visioglobe/places/cleanDiscountAnchorTenants'
    }),
    async resetStateOnMap () {
      await this.setInitialStateOfMap()
      await this.showRouteDescription(false)
      await this.goToDefaultView()
    },
    async showMapPoints () {
      await this.resetStateOnMap()
      if (this.cleanPoints && this.cleanPoints.length) {
        this.cleanPoints.forEach(groupPoits => {
          this.setActiveMapPoint({ mapPoint: groupPoits, poiColor: groupPoits.color })
        })
      }
    },
    async setRouteToNearestPoint () {
      if (!this.cleanPoints || !this.cleanPoints.length) return
      const nearestPoint = await this.getNearestPoint({ mapPoints: this.cleanPoints })
      if (!nearestPoint) return

      if (nearestPoint.vg.poi) {
        const poi = nearestPoint
        this.$store.dispatch('visioglobe/places/transformPopup', { id: poi.id })
        this.setToPoi({ poi, viewMode: 'wholeFloor' })
      } else {
        this.setTo({ id: nearestPoint.vg.id, viewMode: 'wholeFloor' })
      }
    },
    async setActiveSidebarItem (code) {
      if (this.activeTabSidebar === code) return

      this.setActiveTabSidebarMap(code)
      this.setColorsForAnchors({activeAnchor: null})
      this.cleanDiscountAnchorTenants()
      if (this.activeTabSidebar === 'discounts') {
        await this.resetStateOnMap()
        this.addActiveDiscounts()
        return false
      } else {
        await this.showMapPoints()
      }
      if (this.activeTabSidebar === 'toilets') {
        await this.setRouteToNearestPoint()
      }
    },
    getImageByCode (code) {
      return this.activeTabSidebar === code
        ? `white-${code}`
        : `black-${code}`
    },
    async addActiveDiscounts () {
      const { mapPoints } = this.sidebarServices.find(el => el.codeTab === this.activeTabSidebar)
      const groupAnchor = true
      const places = await this.getPlaces(mapPoints)
      if (places && places.length) {
        places.forEach(place => {
          this.paintPlace({ place, groupAnchor })
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$red: color(red);
$rose-fog: color(rose-fog);

.sidebar {
  width: 140px;
  height: 530px;
  top: 50%;
  left: 10px;
  transform: translate(0,-50%);
  z-index: 2;
}
.sidebar-item {
  width: 120px;
  height: 120px;
}
.img-wrapper {
  width: 48px;
  height: 48px;
}
.count {
  top: 10px;
  right: 10px;
}
.active {
  background-color: $red;
  color: white;
  .count, .title {
    color: $rose-fog;
    transition: all 0.3s ease-in-out;
  }
  svg {
    transition: all 0.3s ease-in-out;
  }
  transition: all 0.3s ease-in-out;
}
</style>
