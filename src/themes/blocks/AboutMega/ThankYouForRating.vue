<template>
  <div class="main-content flex center-xs column">
    <div class="description fs32 lh40 weight-700 flex column center-xs">
      {{ $t('Thank you for rating.') }} <br>
      {{ $t('Your opinion is important to us.') }}
    </div>
    <div class="image">
      <img
        class="flex center-xs mw-100 mh-100"
        src="/assets/like.png"
        alt=""
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThankYouForRating'
}
</script>

<style lang="scss" scoped>
.description {
  padding-top: 109px;
}
.image {
  width: 500px;
  height: 500px;
  margin: 0 auto;
}
</style>
