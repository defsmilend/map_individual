<template>
  <div class="navigation-list flex mb35">
    <template v-if="getAllInstructions && getAllInstructions.length > 0">
      <div class="custom-scroll">
        <!--        <p class="m0 weight-700 mb20 fs20 travel-time">-->
        <!--          {{ $t('Travel time') }} ≈ {{ travelTime }} {{ countMinutes }}-->
        <!--        </p>-->
        <div class="route_details">
          <div class="navigation_instructions">
            <div
              ref="navbar"
              class="navbar absolute"
            >
              <div
                ref="navProgress"
                class="navbar_progress absolute"
              />
            </div>
            <div
              v-for="(instruction, i) in getAllInstructions"
              :key="i"
              class="navigation-item flex middle-xs"
            >
              <div
                ref="navPoints"
                class="route_part relative"
              >
                <img
                  v-if="i === 0"
                  class="start_pin absolute"
                  :src="'/assets/map/pin.png'"
                >
                <img
                  v-else-if="i === nbInstructions - 1"
                  v-show="animationEnded"
                  class="start_pin absolute"
                  :src="'/assets/map/destinationPin.png'"
                >
              </div>
              <div
                ref="routeDetails"
                class="route_navigation"
                :class="{ active_nav: selectedNavPoint - 1 === i }"
                @click="pickRouteDetail(i)"
                @touchend="pickRouteDetail(i)"
              >
                <div
                  v-if="i === 0 || !instruction.image"
                  class="image-wrapper flex middle-xs mr15"
                >
                  <img
                    :src="`/assets/map/${instruction.icon}`"
                    width="60"
                    height="60"
                    alt="Route details"
                  >
                </div>
                <div
                  v-else
                  class="image-wrapper flex middle-xs mr15"
                >
                  <img
                    :src="getImageLink(instruction.image)"
                    width="60"
                    height="60"
                  >
                </div>
                <p class="description m0 fs20">
                  {{ instruction.detail }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="qr"
          class="qr-code"
        >
          <div>
            <no-ssr>
              <qrcode
                :value="qrUrl"
                :options="{ width: 176 }"
              />
            </no-ssr>
          </div>
          <div class="qr_details">
            <div class="fs20 weight-700">
              {{ $t('Open route on smartphone') }}
            </div>
            <div>
              <div class="fs16">
                {{ $t('Receive by QR code') }}:
              </div>
              <div class="fs16">
                ({{ $t('a route with a map will open in a browser window') }})
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="fs16 lh25 weight-700">
        {{ $t('Couldn\'t build a route') }}
      </p>
    </template>
  </div>
</template>

<script>
import RouteDetails from 'theme/mixins/RouteDetails/index.js'
// theme/helpers
// import { getImageLink } from '../helpers/index'
// import { jsonBase64Encoder } from '../helpers/index'
import { mapState, mapGetters } from 'vuex'
import NoSSR from 'vue-no-ssr'

export default {
  name: 'RouteDetails',
  components: {
    'no-ssr': NoSSR
  },
  mixins: [RouteDetails],
  props: {
    qr: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      // getImageLink,
      activeDetail: null,
      animationEnded: false
    }
  },
  computed: {
    // qrUrl () {
    //   const encodedData = jsonBase64Encoder({
    //     mallId: this.activeMall.mallId,
    //     terminalId: this.activeMall.terminalId,
    //     fromObjectId: this.activePlaceID,
    //     language: this.$i18n.locale
    //   })
    //   return `${this.qrlink}/${encodedData}`
    // },
    // ...mapState({
    //   qrlink: state => state.config.qrlinks.publicMap,
    //   activeMall: state => state.config.activeMall,
    //   activePlaces: state => state.visioglobe.places.activePlaces,
    //   activePoi: state => state.visioglobe.places.activePoi,
    //   animationDuration: state => state.config.visioglobe.pathAnimationDuration,
    //   selectedNavPoint: state => state.visioglobe.route.selectedNavPoint
    // }),
    activePlaceID () {
      if (this.activePlaces && this.activePlaces[0] && this.activePlaces[0].vg && this.activePlaces[0].vg.id) {
        return this.activePlaces[0].vg.id
      }
      if (this.activePoi && this.activePoi.options('id')) {
        return this.activePoi.options('id')
      }
      return ''
    },
    animationStep () {
      const navPoints = this.$refs.navPoints
      return this.animationDuration && navPoints && navPoints.length ? this.animationDuration / (navPoints.length) : 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initializeRouteDetails()
    })
  },
  updated () {
    this.$nextTick(() => {
      this.initializeRouteDetails()
    })
  },
  methods: {
    initializeRouteDetails () {
      const navPoints = this.$refs.navPoints
      const routeDetails = this.$refs.routeDetails
      if (navPoints && navPoints.length && routeDetails && routeDetails.length) {
        this.prepareAnimation(navPoints, routeDetails)
      }
    },
    prepareAnimation (navPoints, routeDetails) {
      const start = navPoints[0].offsetTop
      const lastPoint = navPoints.length - 1
      const end = navPoints[lastPoint].offsetTop
      const barHeight = end - start
      const navBar = this.$refs.navbar
      this.$refs.navProgress.style.height = '100%'

      navBar.style.height = barHeight + 'px'
      navBar.style.top = start + 10 + 'px'
      this.paintNavPoint(navPoints[0])
      this.showRouteDetail(routeDetails[0])
      this.animateNavigation(lastPoint, navPoints, routeDetails)
    },
    animateNavigation (lastPoint, navPoints, routeDetails) {
      let i = 0
      const animation = setInterval(() => {
        if (i > lastPoint) return
        if (i === lastPoint) {
          this.animationEnded = true
          clearInterval(animation)
        }
        this.paintNavPoint(navPoints[i])
        this.showRouteDetail(routeDetails[i])
        i++
      }, this.animationStep)
    },
    paintNavPoint (point) {
      if (point) {
        point.style.border = '2px solid red'
      }
    },
    showRouteDetail (detail) {
      if (detail) {
        detail.style.opacity = 1
      }
    },
    pickRouteDetail (num) {
      let onlyClearPlace
      let nearPlace
      this.$store.dispatch('visioglobe/route/selectNavPoint', num)
      if (this.allInstructions[num].nearPlace) {
        nearPlace = this.allInstructions[num].nearPlace.id
      }
      if (nearPlace) {
        onlyClearPlace = this.destination.nearPlace.id === nearPlace
      }
      this.$store.dispatch('visioglobe/route/showNearPlace', { nearPlace, onlyClearPlace })
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-scroll {
    max-width: 100% !important;
  }
  .navigation-list {
    flex-direction: column;
  }
  .title {
    max-width: 169px;
  }
  .image-wrapper {
    width: 60px;
    height: 60px;
  }
  .description {
    max-width: 355px;
  }
  .qr-code {
    max-width: 100% !important;
    display: flex;
    margin-right: -4px;
    .qr_details {
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
  }
  .navigation_instructions {
    margin: 0 auto;
    position: relative;
  }
  .navbar {
    width: 3px;
    background: lightgray;
    left: 8px;
  }
  .navbar_progress {
    top: 0;
    width: 100%;
    height: 0%;
    background: red;
    transition: height 3s;
  }
  .navigation-item {
    margin: 15px 0;
  }
  .route_navigation {
    display: flex;
    flex-direction: row;
    margin-left: 30px;
    padding: 25px 15px;
    background: #f6f5f6;
    border-radius: 29px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .route_navigation.active_nav {
    background: #d4858c;
  }
  .route_details {
    display: flex;
    flex-direction: row;
  }
  .route_progress {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }
  .route_progress:after {
    content: '';
    position: absolute;
    width: 3px;
    height: 100%;
    left: 45%;
    background: lightgray;
  }
  .route_progress:hover:before {
    height: 100%;
  }
  .route_part {
    width: 16px;
    height: 16px;
    z-index: 3;
    border: 2px solid lightgray;
    background: white;
    border-radius: 50%;
  }
  .start_pin {
    width: 220%;
    left: -10px;
    top: -10px;
  }
</style>
