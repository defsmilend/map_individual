<template>
  <div id="main-banners">
    <template v-if="gallery && gallery.length">
      <router-link
        to="/map"
        tag="div"
        class="carousel"
      >
        <b-carousel
          id="carousel-fade"
          ref="myCarousel"
          style="text-shadow: 0px 0px 2px #000"
          fade
          :interval="bannerInterval"
          :no-hover-pause="true"
          @sliding-end="sliding"
          @sliding-start="slidingStart"
        >
          <template
            v-for="(banner, index) in gallery"
          >
            <b-carousel-slide
              v-if="banner.video && banner.video.length"
              :key="index"
            >
              <video
                :ref="`video${index}`"
                class="w-100 video-box"
                :src="getVideoLink(banner.video)"
                muted="muted"
                @playing="playingVideo"
                @ended="endedVideo"
                @canplaythrough.once="canPlayThrough(index)"
                @error="errorVideo"
              />
            </b-carousel-slide>
            <b-carousel-slide
              v-else-if="banner.image_id"
              :key="index"
              :img-src="getImageLink(banner.image_id)"
              class="img-fluid w-100 d-block"
            />
          </template>
        </b-carousel>
      </router-link>
    </template>
    <template v-else>
      <div class="flex center-xs middle-xs placeholder">
        <svg-tag-cloud />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {BCarousel, BCarouselSlide} from 'bootstrap-vue'
import { getImageLink, getVideoLink } from 'theme/helpers'
import statistics from 'src/themes/ingka-terminal/mixins/statistics/index.js'
import SvgTagCloud from 'theme/components/theme/blocks/banners/SvgTagCloud.vue'

export default {
  name: 'MainBanner',
  components: {
    BCarousel,
    BCarouselSlide,
    SvgTagCloud
  },
  mixins: [statistics],
  data () {
    return {
      getImageLink,
      getVideoLink,
      bannerInterval: 5000
    }
  },
  computed: {
    ...mapState({
      banners: state => state.banners.banners,
      keyBannerMain: state => state.config.statistic.mainBanner,
      activeGoogleAnalytics: state => state.config.googleAnalytics.active,
      activeMall: state => state.config.activeMall
    }),
    gallery () {
      return this.banners.filter(banner => banner.use_as_big)
    }
  },
  beforeDestroy () {
    if (this.activeGoogleAnalytics === 'true') {
      this.setEventGoogleAnalytics()
    }
  },
  methods: {
    slidingStart (indexVideo) {
      this.startPlayingVideo(indexVideo)
    },
    startPlayingVideo (indexVideo) {
      const videoBanner = this.gallery.find((baner, index) => index === indexVideo)
      if (videoBanner && videoBanner.video && videoBanner.video.length) {
        const currentVideo = `video${indexVideo}`
        if (this.$refs[currentVideo] && this.$refs[currentVideo].length) {
          this.$refs[currentVideo][0].play()
        }
        if (this.gallery.length === 1) {
          this.$refs[currentVideo][0].loop = true
        }
      }
    },
    canPlayThrough (index) {
      if (!index && this.gallery && this.gallery[0] && this.gallery[0].video && this.gallery[0].video.length) {
        this.startPlayingVideo(index)
      }
    },
    endedVideo () {
      this.startSlider()
    },
    errorVideo () {
      this.$refs.myCarousel.next()
    },
    playingVideo () {
      this.pauseSlider()
    },
    pauseSlider () {
      this.$refs.myCarousel.pause()
    },
    startSlider () {
      this.$refs.myCarousel.start()
      this.$refs.myCarousel.next()
    },
    sliding () {
      const indexActiveBanner = this.$refs.myCarousel.index
      const banner = this.gallery[indexActiveBanner]
      if (banner && banner.video && banner.video.length) {
        this.bannerInterval = null
      } else {
        this.bannerInterval = banner.interval * 1000 || 5000
      }
      this.setStatisticBanners(indexActiveBanner, this.keyBannerMain)
    },
    setEventGoogleAnalytics () {
      const { terminalId, mallId } = this.activeMall
      this.$gtm.trackEvent({
        event: 'new session',
        terminalid: terminalId,
        mallid: mallId
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .placeholder {
    min-height: 90vh;
  }
</style>
<style lang="scss">
  #main-banners {
    .video-box {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
    }
    .carousel {
      position: relative;
      width: 100%;

      &-inner {
        position: relative;
        width: 100%;
        overflow: hidden;
        display: flex;
      }

      &-item {
        position: relative;
        transition: transform .6s ease-in-out;
        max-height: 100vh;
        opacity: 0;
        transition-property: opacity;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 100%;
        margin-right: -100%;
        img {
          height: auto;
          max-width: 100%;
          width: 100%;
        }
        &.active {
          z-index: 1 !important;
          opacity: 1 !important;
        }
      }
    }
  }
</style>
