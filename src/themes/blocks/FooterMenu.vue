<template>
  <div class="w-100 flex uppercase container footer-menu">
    <router-link
      v-for="page in footerMenu.pages"
      :key="page.id"
      tag="div"
      :to="localizedRoute(page.link)"
      class="bg-cl-white mx5 page-wrapper brdr-r-5 no-underline"
      :data-menu-button="page.name"
    >
      <div
        class="flex column align-center middle-xs"
        @click="loadDynamicBlock"
      >
        <div class="image-wrapper flex center-xs middle-xs pt15 pb6">
          <component
            :is="`svg-${page.svg}`"
            class="relative svg-component"
          />
        </div>
        <p class="fs14 weight-900 my5">
          {{ $t(page.name) }}
        </p>
      </div>
    </router-link>

    <template v-if="activeMenus && activeMenus.length > 1">
      <dynamic-menu-slider
        :dynamic-menus="activeMenus"
        :dynamic-menu-duration="mall.dynamic_menu_duration"
        :dynamic-menu-speed="mall.dynamic_menu_speed"
        @resetRouteHistory="resetRouteHistory"
      />
      <div
        class="mx2"
      />
    </template>
    <template v-else-if="activeMenus && activeMenus.length == 1">
      <router-link
        tag="div"
        :to="localizedRoute(activeMenus[0].link ? activeMenus[0].link : '/')"
        class="bg-cl-white dynamic-block mx5 brdr-r-5 no-underline flex column align-center middle-xs"
        data-menu-button="dynamicMenu"
        @click="resetRouteHistory"
      >
        <div class="dynamic-img">
          <img
            v-if="activeMenus[0].image_id"
            style="border-radius: 5px 5px 0 0"
            :src="currentImage(activeMenus[0].image_id)"
          >
        </div>
        <p
          v-if="activeMenus[0].title"
          class="weight-900 m0 dynamic-title"
        >
          {{ $t(activeMenus[0].title) }}
        </p>
      </router-link>
    </template>
    <template v-else>
      <div class="mx5 dynamic-block" />
    </template>
    <div
      class="flex column between-xs ml5 mr18"
      @click="isReviewSentClear"
    >
      <router-link
        tag="div"
        :to="localizedRoute(footerMenu.button[0].link)"
        class="bg-cl-white button-wrapper brdr-r-5 no-underline mb5 h-100"
        :data-menu-button="footerMenu.button[0].name"
      >
        <p class="fs14 weight-900 lh20 m0 centered-block center-xs">
          {{ $t(footerMenu.button[0].name) }}
        </p>
      </router-link>
      <router-link
        :to="localizedRoute(footerMenu.button[1].link)"
        class="bg-cl-white button-wrapper brdr-r-5 no-underline mt5 h-100"
        :data-menu-button="footerMenu.button[1].name"
      >
        <p class="fs14 weight-900 lh20 m0 centered-block center-xs">
          {{ $t(footerMenu.button[1].name) }}
        </p>
      </router-link>
    </div>
    <div class="flex column between-xs">
      <div
        v-for="value in footerMenu.languages"
        :key="value.id"
        class="language-wrapper bg-cl-white brdr-r-50 center-xs weight-900 pointer flex middle-xs"
        :class="{'cl-white active-language': value.key === $i18n.locale}"
        @click="changeLanguage(value.key)"
      >
        {{ value.language }}
      </div>
    </div>
  </div>
</template>
<script>
import footerMenu from 'theme/resource/footerMenu.json'
import { mapState } from 'vuex'
import { getImageLink, getPlaceholder } from 'theme/helpers'
import { SvgSearch, SvgMap, SvgShops, SvgMegaServices, SvgFood, SvgKids, SvgDisabledCare, SvgEntertainment, SvgNews } from 'theme/assets/svg'
import DynamicMenuSlider from './DynamicMenuSlider'
import Timer from 'theme/mixins/Timer'
import moment from 'moment'

export default {
  name: 'FooterMenu',
  components: {
    DynamicMenuSlider,
    SvgSearch,
    SvgMap,
    SvgShops,
    SvgMegaServices,
    SvgFood,
    SvgEntertainment,
    SvgKids,
    SvgDisabledCare,
    SvgNews
  },
  mixins: [Timer],
  data () {
    return {
      footerMenu,
      getImageLink
    }
  },
  computed: {
    ...mapState({
      mall: state => state.main.mall || null,
      isReviewSent: state => state.reviews.isReviewSent,
      config: state => state.config,
      dynamicMenus: state => state.dynamicMenus.menus || null
    }),
    activeMenus () {
      const activeMenus = this.dynamicMenus.filter(menu => this.checkMenuPeriods(menu))
      return activeMenus.length > 6 ? activeMenus.slice(0, 6) : activeMenus
    }
  },
  methods: {
    currentImage (id) {
      const type = 'dynamic-menu'
      return id ? getImageLink(id) : getPlaceholder(type)
    },
    changeLanguage (language) {
      this.$i18n.locale = language
      this.$store.dispatch('visioglobe/route/setNavigationLanguageCode', { languageCode: language.slice(0, 2) })
    },
    checkMenuPeriods (menu) {
      return menu.show_time
        .filter(day => day.weekday === this.dayOfWeek)
        .filter(day => moment(this.time, 'HH:mm').isBetween(moment(day.from, 'HH:mm'), moment(day.to, 'HH:mm')))
        .length
    },
    loadDynamicBlock () {
      this.$store.dispatch('keyboard/resetText')
      this.$store.dispatch('main/fetchMallInfo')
      this.$store.dispatch('filters/resetAllFilters')
      this.resetRouteHistory()
    },
    isReviewSentClear () {
      if (this.isReviewSent) {
        this.$store.commit('reviews/setIsReviewSentFlag', '')
      }
      this.resetRouteHistory()
    },
    resetRouteHistory () {
      this.$store.dispatch('routeNavigate/resetRouteHistory')
      this.$store.dispatch('routeNavigate/setCurrentTitle', null)
      this.$store.dispatch('routeNavigate/setTagTitle', '')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~theme/css/icons/icons';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$black: color(black);

.footer-menu {
  a {
    color: $black;
    max-height: 160px;
  }
}
.page-wrapper {
  min-width: 160px;
  min-height: 150px;
  p {
    max-width: 130px;
  }
  .image-wrapper {
    height: 75px;
  }
}
.button-wrapper {
  min-width: 168px;
  max-height: 70px;
}
.language-wrapper {
  min-width: 45px;
  min-height: 45px;
  transition: .4s;
}
.active-language {
  background: $black;
}
.dynamic-block {
  width: 94.5px;
  text-transform: none;

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
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FFF;
  }
  p {
    padding: 2.5px;
  }
}
.svg-component {
  width: 69px;
  height: 62px;
}
</style>
