
<template>
  <div
    class="mall-object-row relative inline-flex w-100 pl30 brdr-r-5 pointer"
    :class="{ active: active }"
    @click="click"
  >
    <template v-if="logo">
      <div class="logo block mr30">
        <img
          class="w-100 h-100"
          :src="logo"
        >
      </div>
    </template>
    <template v-else>
      <div class="logo block mr30">
        <div class="no-outline cover w-100 h-100" />
      </div>
    </template>
    <div
      class="internal-text block"
      :class="{'internal-text--half': half}"
    >
      <div
        class="name cl-black pl5 fs16 lh25 pt0 weight-700"
        :data-content="item.name"
      >
        {{ item.name }}
      </div>
      <div class="description p5 lh15 fs14">
        {{ discription }}
      </div>
      <p class="weight-700 m0 pl4 fs14 lh15">
        {{ getAdditionalInfo(item.visioglobe_id) }}
      </p>
    </div>
    <div
      class="mini-logo absolute brdr-r-5"
      :class="{'hidden': half}"
    >
      <img
        v-for="(coupon, index) in activeCoupons"
        :key="index"
        class="m0 inline-block"
        :src="coupon.image"
        :alt="coupon.title"
      >
    </div>
    <div class="absolute arrow">
      <div class="absolute arrow--inner" />
    </div>
  </div>
</template>

<script>
import discountCoupons from 'theme/resource/discountCoupons.json'
import MallObjectModel from 'theme/components/theme/MallObjectModel'
import { getImageLink, generateItemLink, getMapPoint, declOfNum, getPlaceholder } from 'theme/helpers'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'CategoryMallObject',
  mixins: [
    MallObjectModel
  ],
  props: {
    item: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    half: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      discountCoupons,
      category: []
    }
  },
  computed: {
    ...mapState('visioglobe', ['mapviewer']),
    ...mapState('categories', {
      allCategories: state => state.categories
    }),
    ...mapState({
      config: state => state.config
    }),
    ...mapGetters('terminals', ['getTerminalPosition']),
    logo () {
      const imgId = this.item.company && this.item.company.images && this.item.company.images.length && this.item.company.images[0].id
      const type = 'category-mall-logo'
      return imgId ? getImageLink(imgId) : getPlaceholder(type)
    },
    categories () {
      return this.category.join(', ')
    },
    activeCoupons () {
      let foundMall = []
      if (this.item && this.item.categories) {
        this.discountCoupons.forEach(coupons => {
          let mall = this.item.categories.find(mall => Number(mall.id) === Number(coupons.id) && mall.hidden)
          if (mall) {
            foundMall.push(coupons)
          }
        })
      }
      return foundMall
    },
    discription () {
      const maxStringLength = this.half ? 52 : 120
      if (this.categories.length > maxStringLength) {
        return `${this.categories.substring(0, maxStringLength)}...`
      }
      return this.categories
    }
  },
  beforeMount () {
    if (this.item.categories && this.item.categories.length) {
      for (let i = this.item.categories.length; i > 0; i--) {
        if (this.item.categories[i - 1].active && !this.item.categories[i - 1].hidden) {
          this.category.push(this.item.categories[i - 1].name)
        }
      }
    }
  },
  methods: {
    ...mapActions('visioglobe', ['createMapviewer']),
    ...mapActions('visioglobe/route', ['computeDistanceFromTerminal']),
    click () {
      let link = null
      if (this.item.landing_type) {
        link = this.item.landing_type
      } else {
        link = generateItemLink({
          categories: this.allCategories,
          item: this.item,
          currentRoute: this.$route
        })
      }
      this.$router.push(link)
    },
    getAdditionalInfo (visioglobeID) {
      const point = getMapPoint(this.mapviewer, visioglobeID)
      if (!visioglobeID || !point) return ''

      let num = 0

      if (point.type === 'place') {
        const { position: placePosition } = point.point.vg
        const terminalPosition = this.getTerminalPosition
        const result = this.mapviewer.computeDistance(terminalPosition, placePosition)
        num = Math.round(result)
      }

      if (point.type === 'POI') {
        num = point.point.length
      }

      const result = this.addUnitsOfMeasurement(num, point.type)
      return result
    },
    addUnitsOfMeasurement (num, typeOfPoint) {
      if (!Number.isInteger(num)) return ''

      const units = typeOfPoint === 'place'
        ? ['метр', 'метра', 'метров']
        : ['объект', 'объекта', 'объектов']

      return `${num} ${declOfNum(num, units)}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-white-smoke: color(white-smoke);
$color-pacific-blue: color(pacific-blue);
$black: color(black);

img {
  object-fit: cover;
}

.mall-object-row {
  height: 108px;
  background-color: $color-white-smoke;
  overflow: hidden;
  align-items: center;
  box-sizing: border-box;

  .logo {
    height: 64px;
    width: 64px;

  }
  .internal-text {
    width: 60%;
    height: auto;
    max-height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    &--half {
      width: 240px;
    }
    .description {
      opacity: 0.8;
      color: $black;
    }
  }
  .arrow {
    top: 50%;
    right: 25px;
    transform: translateY(-50%);
    width: 25px;
    height: 100%;
    overflow: hidden;

    &--inner {
      top: 50%;
      right: 50%;
      transform: translate(0%, -50%) rotate(45deg);
      height: 25px;
      width: 25px;
      border: 3px solid $black;
      background: transparent;
    }
  }

  .mini-logo {
    top: 50%;
    right: 80px;
    transform: translateY(-50%);
    width: auto;
    height: 26px;
    overflow: hidden;

    img {
      &:first-child {
        width: 40px;
      }
      &:nth-child(2) {
        width: 33px;
      }
    }
  }
}
</style>
