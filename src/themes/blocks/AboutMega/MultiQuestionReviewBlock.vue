<template>
  <div class="flex between-xs w-100">
    <div
      class="w-100 flex column between-xs"
    >
      <div class="flex column center-xs align-center review-title bg-cl-gray5 mb30">
        <span class="mb10 fs22 lh27 weight-700">
          {{ $t('We want to know your opinion') }}
        </span>
        <span class="fs10 lh14">{{ $t('Take the survey, help us make MEGA better. It will take no more than 2 minutes') }}</span>
      </div>
      <div
        v-if="!isReviewSent"
        class="flex column center-xs align-center page-content"
      >
        <span class="fs16 lh22 weight-700">{{ $t('What is your overall impression of interacting with the navigation kiosk?') }}</span>
        <div class="row center-xs mb30 mt30">
          <div
            v-for="item in questionData"
            :key="item.answerId"
          >
            <div
              class="first-page-images mx20"
              @click="selectItem(item)"
            >
              <img
                class="image"
                :alt="item.answerText"
                :src="item.image"
              >
              <img
                v-show="activeAnswer && activeAnswer.answerId === item.answerId"
                class="absolute mt20 active-image"
                :alt="item.answerText"
                :src="item.activeImage"
              >
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          class="flex column center-xs align-center page-content"
        >
          <span class="fs20 lh28 weight-700">{{ $t('Thank you') + '!' }}</span>
          <div v-if="loading">
            <img
              src="/assets/loader.gif"
              alt="loader"
            >
          </div>
          <transition
            name="fade"
            mode="out-in"
          >
            <div v-if="!loading">
              <span class="fs10 lh14 pt15 pb10">
                {{ $t('Is there anything else you would like to add? Scan the QR code and share your experience with us!') }}
              </span>
              <div>
                <no-ssr>
                  <qrcode
                    class="cover"
                    :value="qrUrl"
                    :options="{ width: 153 }"
                    tag="img"
                    alt=""
                  />
                </no-ssr>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div
        v-if="!isReviewSent"
        class="nav-button-wrapper row center-xs mt10"
      >
        <div
          class="flex column center-xs nav-button cl-silver disabled-btn"
          :class="{'active-btn': activeAnswer}"
          @click="submitReview"
        >
          <span class="fs11 lh13 uppercase weight-700">
            {{ $t('Send') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import multiQuestionReviewFormData from 'theme/mixins/multiQuestionReviewFormData'
import { jsonBase64Encoder } from '@vue-storefront/theme-ingka-terminal/helpers'

export default {
  name: 'AboutMega',
  components: {
    'no-ssr': NoSSR
  },
  mixins: [multiQuestionReviewFormData],
  data: () => ({
    activeAnswer: null,
    responseId: null,
    loading: true,
    isReviewSent: false
  }),
  computed: {
    qrUrl () {
      const encodedData = jsonBase64Encoder({
        mall: this.activeMall.mallId,
        terminal: this.activeMall.terminalId,
        language: this.$i18n.locale,
        responseId: this.responseId
      })
      return `${this.qrlink}?data=${encodedData}`
    }
  },
  methods: {
    selectItem (item) {
      this.activeAnswer = item
    },
    submitReview () {
      this.isReviewSent = true
      this.$store.dispatch('reviews/createMultiQuestionFormResp', { answer: this.activeAnswer, mallId: this.activeMall.mallId })
        .then(res => {
          if (
            res &&
            res.result &&
            res.result.data &&
            res.result.data.id
          ) {
            this.responseId = res.result.data.id
          }
        })
        .catch(err => console.error(err))
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-valencia: color(valencia);
$color-wild-sand: color(wild-sand);
$color-white: color(white);
.review-title {
  border-radius: 14px;
  width: 585px;
  height: 90px;
}
.page-content {
  width: 585px;
}
.first-page-images {
  .active-image {
    margin-left: -10px;
  }
}
.second-page-answers {
  .selector {
    border-radius: 50%;
    width: 16px;
    height: 16px;
  }
  .inner-selector {
    border-radius: 50%;
    width: 6px;
    height: 6px;
  }
  .answer {
    max-width: 505px;
  }
}
.nav-button-wrapper {
  width: 585px;
  .disabled-btn {
    pointer-events: none;
  }
  .active-btn {
    background-color: $color-valencia;
    color: $color-white;
    pointer-events: all;
  }
}
.nav-button {
  border-radius: 39px;
  background-color: $color-wild-sand;
  width: 179px;
  height: 41px;
}
</style>
