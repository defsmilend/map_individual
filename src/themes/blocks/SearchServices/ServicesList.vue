<template>
  <ul class="categories-list p0 my0 ml55 mr50 scroll-area custom-scroll">
    <li
      v-if="!hasRootService"
      class="category-item middle-xs border-box px30 py22 mb5 w-100 bg-cl-gray2 brdr-r-10 flex"
      :class="{'active': rootServiceWithAllMapPoints.id === activeService.id}"
      @click="setActiveItem(rootServiceWithAllMapPoints)"
    >
      <img
        :src="getImagePath(rootServiceWithAllMapPoints)"
        alt=""
        width="64"
        height="64"
        class="mr33"
      >
      <p class="fs16 lh25 weight-700 mt20 name">
        {{ rootServiceWithAllMapPoints.name }}
      </p>
      <p class="count fs14 lh15 cl-gray6 mt20 weight-700 mlauto">
        <span>{{ rootServicePointsCount }}</span>
      </p>
    </li>
    <li
      v-for="service in services"
      :key="service.id"
      class="category-item middle-xs border-box px30 py22 mb5 w-100 bg-cl-gray2 brdr-r-10 flex"
      :class="{'active': service.id === activeService.id}"
      @click="setActiveItem(service)"
    >
      <img
        :src="getImagePath(service)"
        alt=""
        width="64"
        height="64"
        class="mr33"
      >
      <p class="fs16 lh25 weight-700 mt20 name">
        {{ service.name }}
      </p>
      <p class="count fs14 lh15 cl-gray6 mt20 weight-700 mlauto">
        <span v-if="rootService && rootService.id === service.id && services.length > 1">{{ rootServicePointsCount }}</span>
        <span v-else>{{ service.mapPoints && service.mapPoints.length }}</span>
      </p>
    </li>
  </ul>
</template>

<script>
import { getImageLink } from 'theme/helpers'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ServicesList',
  filters: {
    lowerCase (word) {
      return word ? word.toLowerCase() : ''
    }
  },
  props: {
    activeServiceOnPage: {
      type: Object,
      required: true
    },
    rootService: {
      type: Object,
      required: false,
      default: () => {}
    },
    services: {
      type: Array,
      required: true
    },
    activeMallObjectId: {
      type: Number,
      required: false,
      default: null
    }
  },
  data () {
    return {
      getImageLink,
      totalServices: 0,
      activeService: 0
    }
  },
  computed: {
    ...mapState({
      currentActiveService: state => state.map.activeService,
      routeViewScaleFactorOnSearchServices: ({ config }) => config.visioglobe.scaling.routeViewScaleFactorOnSearchServices
    }),
    rootServicePointsCount () {
      let countPoints = 0
      for (let service of this.services) {
        if (this.rootService && this.rootService.id !== service.id && service.mapPoints && service.mapPoints.length) {
          countPoints += service.mapPoints.length
        }
      }
      return countPoints
    },
    hasRootService () {
      return this.rootService.id === this.services[0].id
    },
    rootServiceWithAllMapPoints () {
      if (this.rootService && this.rootService.mapPoints && this.rootService.mapPoints.length) {
        return false
      }
      const allMapPoints2dArray = this.services.map(service => {
        return service.mapPoints
      })
      const allMapPoints = [].concat(...allMapPoints2dArray)
      return Object.assign({}, this.rootService, {
        mapPoints: allMapPoints
      })
    },
    isCurrentRootServiceWithAllMapPoints () {
      return !!this.rootServiceWithAllMapPoints && this.activeServiceOnPage.id === this.rootServiceWithAllMapPoints.id
    }
  },
  async mounted () {
    if ((this.activeServiceOnPage && this.activeServiceOnPage.id) || this.activeMallObjectId) {
      let currentService = this.services.find(service =>
        service.id === this.activeServiceOnPage.id
      )
      if (!currentService && this.isCurrentRootServiceWithAllMapPoints) { // кейс для случая отсутсвия рут сервиса в сервисах
        currentService = this.rootServiceWithAllMapPoints
      }
      if (this.activeMallObjectId) {
        let foundService = this.services.find(service => {
          let currentMallObject = service.mapPoints.find(mallObj => mallObj.id === this.activeMallObjectId)
          if (currentMallObject && service.id !== this.rootService.id) {
            return service
          }
        })
        currentService = foundService || currentService
      }
      this.activeService = currentService || null
      if (currentService && currentService.mapPoints && currentService.mapPoints.length > 0) {
        const mapPointsModifyPromises = currentService.mapPoints.map(({ visioglobe_id, color_code }) => {
          return this.setActiveMapPoint({
            visioglobe_id,
            poiColor: color_code
          })
        })
        await Promise.all(mapPointsModifyPromises)
        this.scaleNearestPoi()
      }
      this.setRouteToNearestPoint(this.activeService)
    }
  },
  methods: {
    ...mapActions({
      setInitialStateOfMap: 'visioglobe/setInitialStateOfMap',
      setActiveMapPoint: 'map/setActiveMapPoint',
      setActiveService: 'map/setActiveService',
      showRouteDescription: 'map/showRouteDescription',
      scaleNearestPoi: 'visioglobe/places/scaleNearestPoi'
    }),
    async setActiveItem (service) {
      if (service.id === this.activeService.id) return

      this.showRouteDescription(false)
      await this.setInitialStateOfMap()

      await this.setActiveServiceMapPoints(service)
      this.setRouteToNearestPoint(service)
      return this.scaleNearestPoi()
    },
    async setRouteToNearestPoint (service) {
      this.setActiveService(service)
      this.activeService = this.currentActiveService
      if (service && service.mapPoints && service.mapPoints.length) {
        const nearestPoi = await this.$store.dispatch('visioglobe/route/getNearestPoint',
          { mapPoints: this.$store.state.visioglobe.places.activePois }
        )
        if (nearestPoi && nearestPoi.vg && nearestPoi.vg.poi) {
          this.$store.dispatch('visioglobe/places/setSelectedSearchPOI', nearestPoi.options('id'))
          const routeOptions = {
            poi: nearestPoi,
            routeViewScaleFactor: this.routeViewScaleFactorOnSearchServices
          }
          this.$store.dispatch('visioglobe/route/setToPoi', routeOptions)
        }
      }
    },
    async setActiveServiceMapPoints (service) {
      if (!service.mapPoints && !service.mapPoints.length) return
      const visioglobePoints = await Promise.all(
        service.mapPoints.map(({ visioglobe_id, color_code }) => {
          this.setActiveMapPoint({
            visioglobe_id,
            poiColor: service.color_code || color_code
          })
        })
      )
      return visioglobePoints
    },
    getImagePath (service) {
      if (service && service.image_id) {
        return this.getImageLink(service.image_id)
      }
      if (service && !service.image_id && Array.isArray(service.images) && service.images[0] && service.images[0].id) { // условие для кейса сервисов с компаниями
        return this.getImageLink(service.images[0].id)
      }
      return this.getImageLink()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
$red: color(red);
$rose-fog: color(rose-fog);

.categories-list {
  width: 438px;
}
.category-item {
  min-height: 108px;
  width: 428px;
  img { object-fit: cover; }
  user-select: none;
}
.active {
  background-color: $red;
  color: white;
  .count {
    color: $rose-fog;
    transition: all 0.3s ease-in-out;
  }
  img {
    transition: all 0.3s ease-in-out;
  }
  transition: all 0.3s ease-in-out;
}
</style>
