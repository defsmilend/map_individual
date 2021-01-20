<template>
  <div
    id="dynamic-menu"
    :dynamicMenus="dynamicMenus"
  >
    <no-ssr>
      <vueper-slides
        ref="dynamicMenu"
        infinite
        autoplay
        :dragging-distance="20"
        fixed-height="160px"
        :prevent-y-scroll="true"
        :arrows="false"
        :duration="dynamicMenuDuration"
        :transition-speed="dynamicMenuSpeed"
        :gap="5"
        class="bg-cl-white dynamic-block brdr-r-5 no-underline flex column align-center middle-xs"
        style="background-color:transparent"
        @ready="addEventListener"
      >
        <vueper-slide
          v-for="(menu, i) in dynamicMenus"
          :key="i"
        >
          <template
            v-slot:content
          >
            <router-link
              tag="div"
              :to="localizedRoute(menu.link ? menu.link : '/')"
            >
              <div
                class="dynamic-img"
              >
                <img
                  draggable="false"
                  :src="getImageLink(menu.image_id)"
                  alt=""
                  class="no-outline"
                  style="border-radius: 5px 5px 0 0"
                >
              </div>
              <div
                v-if="menu.title"
                class="fs14 weight-900 dynamic-title"
              >
                <div>
                  {{ menu.title.toUpperCase() }}
                </div>
              </div>
            </router-link>
          </template>
        </vueper-slide>
      </vueper-slides>
    </no-ssr>
  </div>
</template>

<script>

import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
import NoSSR from 'vue-no-ssr'
import { getImageLink } from 'theme/helpers'

export default {
  name: 'DynamicMenuSlider',
  components: {
    VueperSlides,
    VueperSlide,
    'no-ssr': NoSSR
  },
  props: {
    dynamicMenus: {
      type: Array,
      required: true
    },
    dynamicMenuDuration: {
      type: Number,
      required: true
    },
    dynamicMenuSpeed: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    getImageLink,
    elMenu: null
  }),
  methods: {
    addEventListener () {
      this.elMenu = this.$el
      this.elMenu.addEventListener('touchstart', this.disabledPlay)
      this.elMenu.addEventListener('touchend', this.activePlay)
    },
    activePlay () {
      this.isAutoPlay(false)
    },
    disabledPlay () {
      this.isAutoPlay(true)
    },
    isAutoPlay (isPause) {
      this.$refs.dynamicMenu[`${isPause ? 'pause' : 'resume'}Autoplay`]()
    }
  }
}
</script>
<style lang="scss" scoped>
.dynamic-block {
  width: 94.5px;
  text-transform: none;
  margin-left: 5px;

  .dynamic-img {
    width: 95.5px;
    height: 105px;
    position: relative;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .dynamic-title {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FFF;
  }
}
</style>
<style lang="scss">
  #dynamic-menu {
    .vueperslides__parallax-wrapper {
      border-radius: 5px;
    }
    .vueperslides__parallax-wrapper:before, .vueperslides__parallax-wrapper:after {
      box-shadow: none;
    }
    .vueperslides__inner {
      width: 95.5px;
    }
    .vueperslides__bullets {
      bottom: 60px;
      align-items: start;
      .vueperslides__bullet {
        width: .1px;
        height: .1px;
        outline: none;
        margin: 5px;
        .default {
          border: none;
          outline: none;
          box-shadow: none;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        span {
          height: 5.5px;
          width: 5.5px;
          opacity: .6;
          background-color: lightgray;
          border-radius: 50%;
          display: block;
          font-size: 0;
          mix-blend-mode: hue;
        }
        &--active {
          border-radius: 50%;
          span {
            background-color: #fff;
            width: 5.5px;
            height: 5.5px;
            border-radius: 50%;
            mix-blend-mode: difference;
            opacity: .9;
            filter: invert(.8);
          }
        }
      }
    }
  }
</style>
