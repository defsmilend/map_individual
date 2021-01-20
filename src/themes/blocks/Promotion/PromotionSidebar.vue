<template>
  <div class="promotion-sidevar mr63 ml52 custom-scroll">
    <router-link
      v-for="(promotion, index) in promotionList"
      :ref="promotion.id"
      :key="index"
      tag="div"
      class="promotion-card pointer bg-cl-white-smoke mb5 px30 py20 border-box brdr-r-5"
      :class="{ active: Number(promotion.id) === activeId }"
      :to="{ query: { id: promotion.id} }"
    >
      <div class="fs16 p5 pl0 weight-700 lh25">
        {{ promotion.name | name }}
      </div>
      <date-start-end
        class="fs14 lh15"
        :start-date="promotion.start_date"
        :end-date="promotion.end_date"
      />
    </router-link>
  </div>
</template>

<script>
import DateStartEnd from 'theme/components/theme/dateStartEnd.vue'

export default {
  name: 'PromotionSidebar',
  components: {
    DateStartEnd
  },
  filters: {
    name (name) {
      return name && name.length > 30 ? `${name.substring(0, 27)}...` : name
    }
  },
  props: {
    promotionList: {
      type: Array,
      required: true
    },
    activeId: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    this.scrollToActivePromotion()
  },
  methods: {
    scrollToActivePromotion () {
      this.$refs[this.activeId][0].$el.scrollIntoView()
    }
  }
}
</script>

<style scoped lang="scss">
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-pacific-blue: color(pacific-blue);
  .promotion-card {
    width: 270px;
    height: 108px;
    overflow: hidden;
    &.active {
       background: $color-pacific-blue;
    }
  }
  .promotion-sidevar {
    width: auto;
    max-width: 310px;
    min-width: 279px;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 725px;
  }
  .custom-scroll::-webkit-scrollbar-track-piece {
    margin-bottom: 43px;
  }
</style>
