<template>
  <div
    v-if="isPoiName"
    :id="poi.id"
    :key="poi.count"
    :style="{'width': activePoiWidth}"
    class="svg-popup-map-wrapper"
    :data-map-content="poi.name"
    @click="onClick"
  >
    <div class="relative flex center-xs middle-xs">
      <svg-wrapper-popup
        width="100%"
        :fill="poiColor"
        class="popup-wrapper"
      />
      <template v-if="poi.imageId">
        <div class="w-60 absolute">
          <img
            :key="thumbnail.src"
            v-lazy="thumbnail"
            class="w-100 pb6"
          >
        </div>
      </template>
      <template v-else>
        <component
          :is="`svg-${poi.name}`"
          width="80%"
          class="absolute pb6"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { getImageLink } from 'theme/helpers'
import {
  SvgWrapperPopup,
  SvgToilets,
  SvgSmokingarea,
  SvgBabycare,
  SvgAtm2,
  SvgFoodcourt,
  SvgWardrobe,
  SvgWelcomedesk,
  SvgEnter1RUS,
  SvgFamilytoilet,
  SvgEscalator,
  SvgEscalatorup,
  SvgBaskettrolley,
  SvgBus,
  SvgCapacitycargotrolley,
  SvgChargepoint,
  SvgCoffee,
  SvgCurrencyexchange,
  SvgDisabled,
  SvgFamilyroom,
  SvgFirstAid,
  SvgHandsfreeshopping,
  SvgHoldyourchildren,
  SvgIceskating,
  SvgInformation,
  SvgInternet,
  SvgLocker,
  SvgPlayground,
  SvgStrollersavailable,
  SvgTaxi,
  SvgTelephone,
  SvgTrolley,
  SvgVending,
  SvgTrolleyparking,
  SvgWheelchairsavailable,
  SvgWiFi,
  SvgStairs,
  SvgLifthandicap,
  SvgLift,
  SvgShoeshine,
  SvgUmbrella,
  SvgParking,
  SvgDisabledparking,
  SvgBikeparking,
  SvgEnter3RUS,
  SvgEnter2RUS,
  SvgEnter6RUS,
  SvgEnter5RUS,
  SvgEnter4RUS,
  SvgFemale,
  SvgMale,
  SvgMycop,
  SvgWarmingup
} from 'theme/assets/svg'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'SvgPopup',
  components: {
    SvgToilets,
    SvgSmokingarea,
    SvgBabycare,
    SvgAtm2,
    SvgFoodcourt,
    SvgWardrobe,
    SvgWelcomedesk,
    SvgWrapperPopup,
    SvgEnter1RUS,
    SvgFamilytoilet,
    SvgEscalator,
    SvgEscalatorup,
    SvgBaskettrolley,
    SvgBus,
    SvgCapacitycargotrolley,
    SvgChargepoint,
    SvgCoffee,
    SvgCurrencyexchange,
    SvgDisabled,
    SvgFamilyroom,
    SvgFirstAid,
    SvgHandsfreeshopping,
    SvgHoldyourchildren,
    SvgIceskating,
    SvgInformation,
    SvgInternet,
    SvgLocker,
    SvgPlayground,
    SvgStrollersavailable,
    SvgTaxi,
    SvgTelephone,
    SvgTrolley,
    SvgVending,
    SvgTrolleyparking,
    SvgWheelchairsavailable,
    SvgWiFi,
    SvgStairs,
    SvgLifthandicap,
    SvgLift,
    SvgShoeshine,
    SvgUmbrella,
    SvgParking,
    SvgDisabledparking,
    SvgBikeparking,
    SvgEnter3RUS,
    SvgEnter2RUS,
    SvgEnter6RUS,
    SvgEnter5RUS,
    SvgEnter4RUS,
    SvgFemale,
    SvgMale,
    SvgMycop,
    SvgWarmingup
  },
  props: {
    poi: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      getImageLink
    }
  },
  computed: {
    ...mapState({
      activePoiWidth: state => state.config.visioglobe.scaling.activePoiWidth,
      currentCategory: ({ map }) => map.activeService,
      defaultColor: state => state.config.visioglobe.poiColor,
      activePoi: state => state.visioglobe.places.activePoi
    }),
    isPoiName () {
      return this.poi && this.poi.name
    },
    isSearchServicesRoute () {
      return this.$route.name === 'search-services' || this.$route.name === 'search-services-by-group'
    },
    poiColor () {
      let color = (this.poi && this.poi.color) || this.defaultColor
      if (this.poi.imageId) {
        color = this.defaultColor
      }
      return color
    },
    thumbnail () {
      const image = this.getImageLink(this.poi.imageId)
      return {
        src: image,
        error: '/assets/placeholder.png'
      }
    }
  },
  mounted () {
    if (this.poi && this.poi.name) {
      this.createSvgPoi(this.poi)
      if ((this.poi.id || this.activePoi.id) && (this.isActive || this.poi.group)) {
        const id = this.isActive ? this.poi.id : this.activePoi.id
        this.transformPopup(id)
      }
    }
  },
  beforeDestroy () {
    this.removeSvgPoi(this.poi)
    const svgPopup = document.getElementById(this.poi.id)
    if (svgPopup) {
      svgPopup.remove()
    }
  },
  methods: {
    ...mapActions({
      removeSvgPoi: 'visioglobe/places/removeSvgPoi',
      createSvgPoi: 'visioglobe/places/createSvgPoi',
      setToPoi: 'visioglobe/route/setToPoi',
      setSelectedSearchPOI: 'visioglobe/places/setSelectedSearchPOI'
    }),
    onClick () {
      if (this.activePoi && this.activePoi.id === this.poi.id) return
      this.transformPopup()
      // строим маршрут
      this.setToPoi({ poi: this.poi })
      // открываем сайдбар с описанием маршрута
      if (this.isSearchServicesRoute) {
        const placeId = this.poi.options().id
        const currentObj = this.currentCategory
          ? this.currentCategory.mapPoints.find(el => placeId === el.visioglobe_id)
          : null
        if (currentObj) {
          return this.setSelectedSearchPOI(placeId)
        }
      }
    },
    transformPopup (id) {
      this.resetWidthAndZIndex()
      this.$store.dispatch('visioglobe/places/transformPopup', { id: id || this.poi.id })
    },
    resetWidthAndZIndex () {
      let collectionPopup = document.getElementsByClassName('svg-popup-map-wrapper')
      if (collectionPopup && collectionPopup.length) {
        for (let i = 0; i < collectionPopup.length; i++) {
          collectionPopup[i].style.width = this.activePoiWidth
          collectionPopup[i].style.zIndex = 0
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';

  $black: color(black);
  .svg-popup-map-wrapper {
    transition: width .2s;
  }
  .popup-wrapper {
    filter: drop-shadow(0 0 4px $black);
  }
</style>
