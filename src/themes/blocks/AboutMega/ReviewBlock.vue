<template>
  <div class="flex between-xs w-100">
    <div
      v-if="!isReviewSent"
      class="w-100 flex column between-xs"
    >
      <h2 class="mt0">
        {{ $t('Rate MEGA work') }}
      </h2>
      <div class="stars-section w-100 flex relative fs16 lh20">
        <div class="dislike-block">
          <span class="pl30">{{ $t(`I don't like`) }}!</span>
          <div class="arrow-wrapper">
            <img
              src="/assets/icons/Line-1.png"
              alt="arrow"
              class="absolute"
            >
          </div>
        </div>
        <div class="row">
          <div class="stars-box flex center-xs">
            <div
              v-for="i in 11"
              :key="i"
              class="star-container"
              @click="setRate(i - 1)"
            >
              <div class="rate-number-wrapper align-center fs16 mb3">
                <span v-if="currentRate !== (i - 1)">{{ i - 1 }}</span>
              </div>
              <div>
                <img
                  class="star-image"
                  :src="getStarUrl(i)"
                  alt="star"
                >
                <img
                  v-if="currentRate === (i - 1)"
                  class="absolute sparks"
                  src="/assets/icons/sparks.png"
                  alt="sparks"
                >
              </div>
            </div>
          </div>
          <button-full
            v-if="currentRate !== null"
            class="submit-button"
            :title="$t('Submit rate')"
            @click="submitReview"
          />
        </div>
        <div class="like-block end-xs mb45">
          {{ $t('Fine') }}!
          <div class="arrow-wrapper">
            <img
              src="/assets/icons/Line-2.png"
              alt="arrow"
              class="absolute"
            >
          </div>
        </div>
      </div>
      <transition name="fade">
        <div
          v-if="isFeedbackShow"
          class="qr-section flex w-100 relative mb30"
        >
          <div class="flex col-xs-11">
            <div class="flex col-xs-8 ml40 middle-xs px0">
              <no-ssr>
                <qrcode
                  class="cover"
                  style="mix-blend-mode:color-burn"
                  :value="qrUrl"
                  :options="{ width: 130 }"
                  tag="img"
                  alt=""
                />
              </no-ssr>
              <div class="start-xs ml36">
                <div
                  class="col-xs-10 lh28 fs20 weight-700 px0"
                  v-html="$t('You can leave a detailed review on the site')"
                />
                <div class="col-xs-8 px0 lh18 fs14 mt5">
                  {{ $t('QR code to open the feedback form on your phone') }}
                </div>
              </div>
            </div>
          </div>
          <div class="col-xs-10 perspective absolute w-100 h-100 brdr-r-41 gradient" />
          <div class="absolute about-mega-phone">
            <img
              src="/assets/about_mega_phone_img2.png"
              alt="phone"
            >
          </div>
        </div>
      </transition>
    </div>
    <thank-you-for-rating v-else />
  </div>
</template>

<script>

import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { mapState } from 'vuex';
import NoSSR from 'vue-no-ssr'
import { jsonBase64Encoder } from '@vue-storefront/theme-ingka-terminal/helpers'
import ThankYouForRating from 'src/themes/ingka-terminal/components/theme/blocks/AboutMega/ThankYouForRating.vue'

export default {
  name: 'AboutMega',
  components: {
    ButtonFull,
    'no-ssr': NoSSR,
    ThankYouForRating
  },
  data: () => ({
    currentRate: null,
    text: '',
    isFeedbackShow: false,
    reviewLinks: [
      { id: 1, title: 'SMS', imgLink: '/assets/placeholder.png' },
      { id: 2, title: 'WHATSAPP', imgLink: '/assets/placeholder.png' },
      { id: 3, title: 'FACEBOOK MESSENGER', imgLink: '/assets/placeholder.png' },
      { id: 4, title: 'TELEGRAM', imgLink: '/assets/placeholder.png' }
    ]
  }),
  computed: {
    qrUrl () {
      const encodedData = jsonBase64Encoder({
        rate: this.currentRate,
        mall: this.activeMall.mallId,
        terminal: this.activeMall.terminalId,
        language: this.$i18n.locale
      })
      return `${this.qrlink}?data=${encodedData}`
    },
    ...mapState({
      qrlink: state => state.config.qrlinks.feedback,
      activeMall: state => state.config.activeMall,
      isReviewSent: state => state.reviews.isReviewSent
    })
  },
  beforeDestroy () {
    if (this.isReviewSent) {
      this.$store.commit('reviews/setIsReviewSentFlag', '')
    }
  },
  mounted () {
    this.isFeedbackShow = true
  },
  methods: {
    setRate (rate) {
      this.currentRate = rate
    },
    submitReview () {
      this.$store.dispatch('reviews/create', { text: this.text, rate: this.currentRate })
        .then(() => { this.currentRate = null })
        .catch(err => console.error(err))
    },
    getStarUrl (i) {
      if (this.currentRate !== null) {
        return (this.currentRate < (i - 1)) ? '/assets/icons/star_empty.png' : '/assets/icons/star_full.png'
      }
      return '/assets/icons/star_empty.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.submit-button {
  margin-top: 45px;
  margin-left: 25px;
}
.stars-box {
  width: 955px;
}
.qr-section {
  height: 178px;
  .perspective {
    z-index: -1;
  }
  .cover {
    object-fit: cover;
    width: 120px;
  }
}
.stars-section {
  padding-bottom: 10px;
  flex-direction: column;
  .star-container {
    width: 60px;
    height: 105px;
    margin: 15px 15px 0;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
    .star-image {
      max-width: 100%;
      min-width: 100%;
    }
  }
}
.like-block {
  margin-right: 17%;
  img {
    top: 85px;
    right: 170px;
  }
}
.dislike-block {
  img {
    top: 8px;
    left: -3px;
  }
}
.arrow-wrapper {
  pointer-events: none;
}
.sparks {
  margin-left: -67px;
  top: 30px;
}
.rate-number-wrapper {
  min-height: 20px
}
.gradient {
  background: #D3D3D3;
}
.about-mega-phone {
  left: 40.4%;
  top: -43%;
  img {
    width: 110%;
  }
}
</style>
