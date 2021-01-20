<template>
  <section class="feedback-block">
    <h2 class="title mb20">
      {{ $t('Feedback') }}
    </h2>
    <div class="buttons-wrapper flex">
      <button-full
        class="feedback-button"
        :title="$t('Call me')"
      />
    </div>
  </section>
</template>

<script>
import ButtonFull from 'theme/components/theme/ButtonFull.vue'

export default {
  name: 'FeedbackBlock',
  components: {
    ButtonFull
  }
}
</script>

<style lang="scss" scoped>
</style>
