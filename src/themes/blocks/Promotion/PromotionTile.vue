<template>
  <router-link
    tag="div"
    class="promotion-tile mb14 mr14 pointer brdr-r-5"
    :to="{ name: promotion.link, query: { id: promotion.id } }"
  >
    <div
      class="main-img cover cover-bgt relative w-100"
      :style="`background-image: url(${getBgImage()});`"
    >
      <template v-if="company">
        <div class="logo-img absolute flex center-xs">
          <img
            :src="getLogoImage()"
            alt=""
            width="270"
            height="150"
          >
        </div>
      </template>
    </div>
    <div class="discription bg-cl-white-smoke pt20 pb10 px30 flex column relative">
      <div class="promotion-name mb10 fs18 lh19 weight-700">
        {{ promotion.name }}
      </div>
      <div class="promotion-summary fs14 lh18">
        {{ promotion.summary }}
      </div>
      <date-start-end
        class="date-start-end"
        :start-date="promotion.start_date"
        :end-date="promotion.end_date"
      />
    </div>
  </router-link>
</template>

<script>
import { getImageLink } from 'theme/helpers'
import DateStartEnd from 'theme/components/theme/dateStartEnd.vue'
import { mapState } from 'vuex'

export default {
  name: 'PromotionTile',
  components: {
    DateStartEnd
  },
  props: {
    promotion: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      optionDate: {
        day: 'numeric',
        month: 'long'
      },
      getImageLink
    }
  },
  computed: {
    ...mapState({
      config: state => state.config
    }),
    backImageId () {
      if (Array.isArray(this.promotion.images)) {
        return this.imageId(this.promotion.images)
      }
      return null
    },
    company () {
      return this.promotion.company || null
    },
    logoImageId () {
      if (this.company && Array.isArray(this.company.images)) {
        return this.imageId(this.company.images)
      }
      return null
    },
    getNameLink () {
      return this.promotion && this.promotion.link ? this.promotion.link : ''
    }
  },
  methods: {
    getBgImage () {
      const type = 'bg'
      return this.backImageId ? getImageLink(this.backImageId) : this.placeholderImg(type)
    },
    getLogoImage () {
      const type = 'logo'
      return this.logoImageId ? getImageLink(this.logoImageId) : this.placeholderImg(type)
    },
    placeholderImg (type) {
      const link = this.getNameLink
      return this.config.placeholders[`${type}-${link}`] ? this.config.placeholders[`${type}-${link}`].placeholderImg : this.config.placeholders.default.placeholderImg
    },
    imageId (imageArr) {
      let imageObj = imageArr.find(image => image.id)
      return imageObj ? imageObj.id : null
    }
  }
}
</script>

<style lang="scss" scoped>
.date-start-end /deep/ {
  position: absolute;
}
.promotion-tile {
  &:nth-child(4n) {
    margin-right: 0;
  }
  &:last-child {
    margin-bottom: 100px;
  }
  overflow: hidden;
  .main-img {
    height: 150px;
    background-size: contain;
  }
  .logo-img {
    width: 74px;
    height: 74px;
    left: 30px;
    top: 85px;
    img {
      z-index: 1;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .discription {
    height: 182px;
  }
  .date-start-end {
    bottom: 15px;
    left: 30px;
  }
  .promotion-summary {
    height: 90px;
    overflow: hidden;
  }
  .promotion-name {
    max-height: 60px;
    overflow: hidden;
  }
}
</style>
