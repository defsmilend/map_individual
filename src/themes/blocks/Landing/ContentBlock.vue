<template>
  <div
    v-lazy:background-image="item.image"
    class="fs35 lh45 flex px48 pt76 flex between-xs brdr-r-20 mb48 content-block border-box relative"
    :class="{
      'bg-cl-orange2': item.bgColor === 'orange2',
      'bg-cl-bleu5': item.bgColor === 'bleu5',
      'bg-cl-beht': item.bgColor === 'beht'
    }"
  >
    <div class="main-description relative">
      <h1
        class="fs40 m0 mb35 title"
        v-html="item.title"
      />
      <template v-if="item.numberedList && item.numberedList.length">
        <numbered-list :list="item.numberedList" />
      </template>
      <template v-else>
        <p v-html="item.description" />
      </template>
      <template v-if="item.imageLine">
        <div class="absolute icon-line">
          <img :src="item.imageLine">
        </div>
      </template>
    </div>
    <template v-if="item.coupons && item.coupons.length">
      <div>
        <coupons :list="item.coupons" />
        <template v-if="item.signature">
          <p
            class="fs12 lh15"
            v-html="item.signature"
          />
        </template>
      </div>
    </template>
    <template v-else-if="item.cards && item.cards.length">
      <div>
        <cards :list="item.cards" />
        <template v-if="item.signature">
          <p
            class="fs20 weight-700 align-right"
            v-html="item.signature"
          />
        </template>
      </div>
    </template>
    <template v-if="item.button">
      <router-link
        :to="item.button.link"
        tag="div"
        class="fs22 weight-700 mt41 flex align-center button-link absolute"
      >
        {{ item.button.name }}
        <svg-back-arrow class="svg-back-arrow ml25" />
      </router-link>
    </template>
    <template v-else-if="item.imageBlockCenter">
      <div class="w-100 image-block-center">
        <img src="/assets/MegaFriends/FriendsScale.webp">
      </div>
    </template>
    <template v-if="item.content">
      <div
        class="align-right pt54 cl-white"
        v-html="item.content"
      />
    </template>
  </div>
</template>

<script>
import NumberedList from 'theme/components/theme/blocks/Landing/NumberedList.vue'
import Coupons from 'theme/components/theme/blocks/Landing/Coupons.vue'
import Cards from 'theme/components/theme/blocks/Landing/Cards.vue'
import { SvgBackArrow } from 'theme/assets/svg'

export default {
  name: 'ContentBlock',
  components: {
    NumberedList,
    Coupons,
    Cards,
    SvgBackArrow
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .svg-back-arrow {
    width: 40px;
    transform: rotate(180deg);
  }
  .button-link {
    right: 52px;
    bottom: 32px;
  }
  .content-block {
    background-size: cover;
    background-repeat: no-repeat;
    height: 540px;
    background-position: 100%;
  }
</style>
