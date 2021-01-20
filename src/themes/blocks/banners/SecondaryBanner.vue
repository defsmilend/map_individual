<template>
  <div id="secondary-banner">
    <div class="parent-banner">
      <template v-if="otherImg">
        <div
          class="cover w-100 h-100 brdr-r-20 brdr-2 brdr-cl-gray7"
          :style="`background-image: url('${otherImg}');`"
        />
      </template>
      <template v-else>
        <template v-if="gallery && gallery.length">
          <no-ssr>
            <vueper-slides
              ref="secondaryBanner"
              infinite
              autoplay
              fixed-height="680px"
              :dragging-distance="70"
              :prevent-y-scroll="true"
              :arrows="false"
              :speed="4000"
              @ready="addEventListener"
              @slide="sliding"
            >
              <vueper-slide
                v-for="(slide, i) in gallery"
                :key="i"
              >
                <template v-slot:content>
                  <div
                    class="vueperslide__content w-100 h-100 relative"
                    @click="goTo(slide)"
                  >
                    <div class="w-100 h-100 flex center-xs middle-xs img-wrapper">
                      <img
                        draggable="false"
                        :src="getImageLink(slide.cover.id)"
                        alt=""
                        class="no-outline"
                      >
                    </div>
                    <div
                      v-if="slide.title || slide.description"
                      class="text-info cl-black bg-cl-white flex absolute px40 py30 border-box"
                    >
                      <div
                        v-if="slide.title"
                        class="fs32 lh39 weight-900"
                      >
                        {{ slide.title }}
                      </div>
                      <div
                        v-if="slide.description"
                        class="fs16 lh19 mt10"
                      >
                        {{ slide.description }}
                      </div>
                    </div>
                  </div>
                </template>>
              </vueper-slide>
            </vueper-slides>
          </no-ssr>
        </template>
        <template v-else>
          <div class="flex center-xs middle-xs h-100">
            <img
              class="w-100"
              :src="getPlaceholder('second-banner')"
            >
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>

import NoSSR from 'vue-no-ssr'
import { mapState } from 'vuex'
import { getImageLink, generateBannerLink, getPlaceholder } from 'theme/helpers'
import statistics from 'src/themes/ingka-terminal/mixins/statistics/index.js'
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

export default {
  name: 'SecondaryBanner',
  components: {
    VueperSlides,
    VueperSlide,
    'no-ssr': NoSSR
  },
  mixins: [statistics],
  props: {
    otherImg: {
      type: String,
      required: false,
      default: null
    }
  },
  data () {
    return {
      getImageLink,
      generateBannerLink,
      getPlaceholder,
      elSecondaryBanner: null
    }
  },
  computed: {
    ...mapState({
      banners: state => state.banners.banners,
      secondaryBanner: state => state.config.statistic.secondaryBanner
    }),
    gallery () {
      return this.banners.filter(banner => !banner.use_as_big)
    }
  },
  beforeDestroy () {
    if (this.elSecondaryBanner) {
      this.elSecondaryBanner.removeEventListener('touchstart', this.disabledPlay)
      this.elSecondaryBanner.removeEventListener('touchend', this.activePlay)
    }
  },
  methods: {
    addEventListener () {
      this.elSecondaryBanner = this.$el
      const isDisabledAutoPlay = this.gallery && this.gallery.length === 1
      if (this.elSecondaryBanner && !isDisabledAutoPlay) {
        this.elSecondaryBanner.addEventListener('touchstart', this.disabledPlay)
        this.elSecondaryBanner.addEventListener('touchend', this.activePlay)
      } else {
        this.isAutoPlay(isDisabledAutoPlay)
      }
    },
    activePlay () {
      this.isAutoPlay(false)
    },
    disabledPlay () {
      this.isAutoPlay(true)
    },
    isAutoPlay (isPause) {
      this.$refs.secondaryBanner[`${isPause ? 'pause' : 'resume'}Autoplay`]()
    },
    sliding () {
      const indexActiveBanner = this.$refs.secondaryBanner.slides.current
      this.setStatisticBanners(indexActiveBanner, this.secondaryBanner)
    },
    goTo (slide) {
      const link = generateBannerLink(slide)
      if (link.name) {
        this.$router.push(link)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.parent-banner {
  opacity: 0.8;
  background-color: #FFFFFF;
  height: 680px;
  width: 670px;
}
</style>
<style lang="scss">
  #secondary-banner {
    .text-info {
      width: 486px;
      flex-direction: column;
      min-height: 130px;
      bottom: 143px;
      right: 0;
    }
    .vueperslide {
      margin-left: 20px;
      height: 680px;
      width: 650px;
    }
    .vueperslides__parallax-wrapper {
      border-radius: 15px;
    }
    .vueperslides__parallax-wrapper:before, .vueperslides__parallax-wrapper:after {
      box-shadow: none;
    }
    .vueperslide__content {
      border: 2px solid rgba(0,0,0,0.2);
      border-radius: 20px;
      background-color: #FFFFFF;
      box-sizing: border-box;
      overflow: hidden;
      height: 676px;
      width: 650px;
    }
    .img-wrapper {
      img {
        height: 100%;
      }
    }
    .vueperslides__bullets {
      bottom: 10px;
      align-items: center;
      .vueperslides__bullet {
        width: 17px;
        height: 17px;
        outline: none;
        .default {
          background-color: transparent;
          border: none;
          outline: none;
          box-shadow: none;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        span {
          height: 8px;
          width: 8px;
          background-color: #000;
          display: block;
          color: #000;
          font-size: 0;
          border-radius: 50%;
        }
        &--active {
          border: 1px solid #EDC782;
          border-radius: 50%;
          span {
            width: 6px;
            height: 6px;
          }
        }
      }
    }
  }
</style>
