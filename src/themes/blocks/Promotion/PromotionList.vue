<template>
  <div
    ref="promotionList"
    class="promotion-list flex fl-start scroll-area custom-scroll"
  >
    <template v-if="promotionList && promotionList.length">
      <promotion-tile
        v-for="(promotion, index) in promotionList"
        :key="index"
        :promotion="promotion"
        class="promotion-tile"
        :data-content="promotion.name"
      />
    </template>
  </div>
</template>

<script>
import PromotionTile from 'theme/components/theme/blocks/Promotion/PromotionTile'

export default {
  name: 'PromotionList',
  components: {
    PromotionTile
  },
  props: {
    promotionList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.promotion-tile {
  width: 270px;
  height: 360px;
}
</style>
