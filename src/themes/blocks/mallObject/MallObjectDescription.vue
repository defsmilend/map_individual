<template>
  <div class="mall-object-description">
    <template v-if="mallObject.description">
      <div class="mb30">
        <p
          class="fs18 mb0 description lh24"
          :class="{'active-description': isDescription}"
          v-html="mallObject.description.replace(/(\n\s*)/gm, '<br><br>')"
        />
        <div
          class="fs20 weight-900 cl-blue3 pointer lh30"
          @click="openDescription"
        >
          {{ isDescription ? $t('Hide') : $t('More details') }}
        </div>
      </div>
    </template>
    <template v-else-if="mallObject.company && mallObject.company.description">
      <div class="mb30">
        <p
          class="fs18 mb0 description lh24 mt0"
          :class="{'active-description': isDescription}"
          v-html="mallObject.company.description.replace(/(\n\s*)/gm, '<br><br>')"
        />
        <div
          class="fs20 weight-900 cl-blue3 pointer lh30"
          @click="openDescription"
        >
          {{ isDescription ? $t('Hide') : $t('More details') }}
        </div>
      </div>
    </template>
    <template v-if="activeCoupons.length">
      <div class="flex fs15 mb25">
        <div
          v-for="(coupon, index) in activeCoupons"
          :key="index"
          class="flex middle-xs"
        >
          <div class="mr15">
            <img
              :src="coupon.image"
              :alt="coupon.title"
            >
          </div>
          <p class="coupon-title">
            {{ coupon.title }}
          </p>
        </div>
      </div>
    </template>
    <template v-if="mallObjectOffers && mallObjectOffers.length">
      <promotion-list :promotion-list="mallObjectOffers" />
    </template>

    <div class="flex between-xs mb20">
      <div>
        <template v-if="mallObject.work_time && mallObject.work_time.length">
          <h2 class="fs20 pl0 mb15 lh25">
            {{ $t('Working hours') }}
          </h2>
          <p
            v-for="(work, index) in mallObject.work_time"
            :key="index"
            class="m0 fs20 lh25"
          >
            {{ work.name | formatWorkName }} {{ work.work.from }} &ndash; {{ work.work.to }}
          </p>
        </template>
        <template v-if="mallObject.phones">
          <h2 class="fs20 pl0 mb15 lh25">
            {{ $t('Phone') }}
          </h2>
          <p class="m0 fs20 lh25">
            {{ mallObject.phones }}
          </p>
        </template>
      </div>
      <template v-if="isCarsharing">
        <div class="mobile-application">
          <h2 class="fs20 pl0 mb15 mt0 lh25">
            {{ $t('DownloadTheApp') }}
          </h2>
          <p class="m0 fs20 lh25 mb24">
            {{ $t('You can rent a car through the BelkaCar app. Download it to your smartphone.') }}
          </p>
          <div class="links-by-download flex w-100">
            <router-link
              tag="div"
              :to="{
                name: 'download-app',
                query: { link: mallObject.apple_store_link,
                         title: $t('Download the app for', { name: mallObject.name, appliance: 'iPhone' }),
                         backTitle: 'Car sharing',
                         visioglobeID : mallObject.visioglobe_id }
              }"
              class="pointer link mr20 no-underline"
            >
              <img
                :src="iconAppStore"
                class="w-100 h-100"
              >
            </router-link>
            <router-link
              tag="div"
              :to="{
                name: 'download-app',
                query: { link: mallObject.google_play_link,
                         title: $t('Download the app for', { name: mallObject.name, appliance: 'Android' }),
                         backTitle: 'Car sharing',
                         visioglobeID : mallObject.visioglobe_id }
              }"
              class="pointer link no-underline"
            >
              <img
                :src="iconGooglePlay"
                class="w-100 h-100"
              >
            </router-link>
          </div>
        </div>
      </template>
    </div>

    <template v-if="tags && tags.length && !isCarsharing">
      <div class="tags mt75">
        <h2 class="fs20 pl0 mb15 lh25">
          {{ $t('Tags') }}
        </h2>
        <div class="tags-area flex fl-start mb70">
          <button-full
            v-for="(tag, index) in tags"
            :key="index"
            class="brdr-r-25 mr15 mb10"
            background="white"
            :title="tag.name.trim()"
            @click.native="goToCategoryPage(tag)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import discountCoupons from 'theme/resource/discountCoupons.json'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { getImageLink } from 'theme/helpers'
import { mapState, mapGetters } from 'vuex'
import PromotionList from 'theme/components/theme/blocks/Promotion/PromotionList'

export default {
  name: 'MallObjectDescription',
  components: {
    ButtonFull,
    PromotionList
  },
  filters: {
    formatWorkName (name) {
      return name ? `${name}:` : ''
    }
  },
  props: {
    mallObject: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      discountCoupons,
      isDescription: false,
      optionDate: {
        month: 'long',
        day: 'numeric'
      },
      getImageLink
    }
  },
  computed: {
    ...mapState({
      carsharing: state => state.config.carsharing,
      currentTitle: state => state.routeNavigate.currentTitle
    }),
    ...mapGetters({
      offers: 'mallOffers/items'
    }),
    isCarsharing () {
      return this.mallObject.categories.some(v => String(v.id) === String(this.carsharing.categoryId))
    },
    activeCoupons () {
      let foundMall = []
      if (this.mallObject && this.mallObject.categories) {
        this.discountCoupons.forEach(coupons => {
          let mall = this.mallObject.categories.find(mall => Number(mall.id) === Number(coupons.id) && mall.hidden)
          if (mall) {
            foundMall.push(coupons)
          }
        })
      }
      return foundMall
    },
    tags () {
      return this.mallObject.categories.filter(tag => !tag.hidden)
    },
    iconAppStore () {
      return this.iconLocale('app-store')
    },
    iconGooglePlay () {
      return this.iconLocale('google-play')
    },
    mallObjectOffers () {
      return this.offers.filter(offer => {
        try {
          return offer.mallObjects.find(mallObject => Number(mallObject.id) === Number(this.mallObject.id))
        } catch (e) {
          return false
        }
      })
    }
  },
  watch: {
    mallObject () {
      this.isDescription = false
    }
  },
  methods: {
    openDescription () {
      this.isDescription = !this.isDescription
    },
    loadOffers () {
      this.$store.dispatch('mallOffers/load', { fieldFilter: 'mallObjects.id', value: this.mallObject.id })
    },
    iconLocale (icon) {
      return this.$i18n.locale === 'ru-RU' ? `/assets/icons/${icon}-ru.png` : `/assets/icons/${icon}-en.png`
    },
    goToCategoryPage (tag) {
      this.$store.dispatch('routeNavigate/setCurrentTitle', { title: this.currentTitle.title, isBig: false })
      this.$store.dispatch('routeNavigate/setTagTitle', tag.name)
      this.$router.push({ name: 'category-page', query: { categories: String(tag.id) } })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-white: color(white);

.text-store {
  p {
    color: $color-white;
    word-wrap: unset;
    white-space: nowrap;
  }
}
.coupon-title {
  max-width: 140px;
}
.description {
  transition: max-height .5s linear;
  overflow: hidden;
  max-height: 74px;
  -webkit-font-smoothing: subpixel-antialiased;
  transform: translateZ(0) scale(1.0, 1.0);
}
.active-description {
  max-height: 1500px;
}
.mobile-application {
  width: 350px;
  height: auto;
}
.links-by-download {
  box-sizing: border-box;
  .link {
    width: 160px;
  }
}
</style>

<style lang="scss">
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-white: color(white);

.mall-object-description {
  .promotion-list {
    height: auto;
    overflow-y: visible;
    .promotion-tile {
      margin-bottom: 20px;
      border-radius: 15px;
      .discription {
        background: $color-white;
      }
    }
  }
}
</style>
