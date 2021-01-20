<template>
  <div class="flex mt10 mr5">
    <div
      v-for="(coupon, index) in list"
      :key="index"
      v-lazy:background-image="'/assets/MegaFriends/Coupon.webp'"
      class="coupons p20 pb0 mr10 border-box"
    >
      <div class="image mb14">
        <img
          class="w-100"
          src="/assets/MegaFriends/MegaFriendsLogo.webp"
        >
      </div>
      <h3 class="m0 title lh25 fs18">
        {{ coupon.title }}
      </h3>
      <p class="m0 fs12">
        Действует до {{ coupon.validity }}
      </p>
      <p class="fs36 cl-orange weight-700">
        {{ coupon.balls }}<span class="fs20 weight-500"> баллов</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Coupons',
  props: {
    list: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .coupons {
    background-size: contain;
    background-repeat: no-repeat;
    width: 230px;
    &:last-child {
      margin-right: 0;
    }
  }
  .image {
    right: -95px;
    bottom: 226px;
    height: 85px;
    width: 85px;
  }
  .title {
    height: 75px;
    max-width: 139px;
  }
</style>
