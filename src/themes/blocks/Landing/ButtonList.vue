<template>
  <div class="flex weight-700 uppercase fs25 mx47 lh29 brdr-bottom-8 brdr-cl-gray10 bg-cl-white relative">
    <div
      v-for="(button, index) in buttonList"
      :key="index"
      class="button center-xs pt33 pb19"
      :class="{'active-button': activeTabId === button.id}"
      @click="scrollIntoView(button.id)"
    >
      <div>{{ button.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonList',
  props: {
    buttonList: {
      type: Array,
      required: true
    },
    activeTabId: {
      type: String,
      default: ''
    }
  },
  methods: {
    scrollIntoView (id) {
      this.$emit('selected-button', id)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~theme/css/variables/colors";
  @import "~theme/css/helpers/functions/color";
  $black: color(black);
  .button {
    max-width: 304px;
    min-width: 304px;
  }
  .active-button:after {
    display: block;
    content: "";
    height: 8px;
    width: 100%;
    background-color: $black;
    position: relative;
    top: 27px;
  }
</style>
