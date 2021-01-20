<template>
  <div class="promotion-card brdr-r-20 bg-cl-white-smoke relative pb20 mr42">
    <div
      class="main-img w-100 brdr-top-20 absolute"
      :style="`background-image: url(${getImageLink(backgroundImageId)});`"
    />
    <div class="content-card relative mx40">
      <h1 class="fs28 lh45 mb30">
        {{ promotion.summary }}
      </h1>
      <date-start-end
        class="mb30 fs18 weight-700 lh25"
        :start-date="promotion.start_date"
        :end-date="promotion.end_date"
      />
      <template v-if="isShowButton">
        <button-full
          class="mb20"
          @click.native="$emit('click-button')"
        >
          {{ $t('to the store') }}
        </button-full>
      </template>
      <div v-html="contentProcessing(promotion)" />
    </div>
  </div>
</template>

<script>
import { getImageLink } from 'theme/helpers'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import DateStartEnd from 'theme/components/theme/dateStartEnd.vue'

export default {
  name: 'PromotionCard',
  components: {
    ButtonFull,
    DateStartEnd
  },
  props: {
    promotion: {
      type: Object,
      default: null
    },
    isShowButton: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      getImageLink
    }
  },
  computed: {
    backgroundImageId () {
      if (this.promotion && Array.isArray(this.promotion.images)) {
        return this.findImageId(this.promotion.images)
      } else {
        return null
      }
    }
  },
  methods: {
    contentProcessing (promotion) {
      let content = ''
      if (promotion && promotion.content) {
        content = promotion.content.replace(/(\n\s*)/gm, '<br>')
      }
      return content
    },
    findImageId (images) {
      let image = images.find(image => image.id)
      return image ? image.id : null
    }
  }
}
</script>

<style scoped lang="scss">
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-white-smoke: color(white-smoke);

  .promotion-card {
    width: 725px;
    height: 660px;
    overflow-y: auto;
  }
  .main-img {
    height: 455px;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: inset 0px -255px 174px -71px $color-white-smoke,
    inset 0px -35px 17px -30px $color-white-smoke;
    background-position: 50% -2px;
  }
  .content-card {
    z-index: 1;
    margin-top: 300px;
  }
</style>
