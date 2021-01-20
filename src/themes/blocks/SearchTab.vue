<template>
  <div class="tab-bar mb15 pl0 fs16 lh19 weight-700 bg-cl-pumice brdr-r-40 flex middle-xs">
    <div
      class="w-100 h-100 uppercase cl-black brdr-r-40 pointer flex center-xs middle-xs"
      :class="{'active': isActiveByName}"
      @click="$emit('active', 'by-name')"
    >
      {{ $t('Search by name') }}
    </div>
    <div
      class="w-100 h-100 uppercase cl-black brdr-r-40 pointer flex center-xs middle-xs"
      :class="{'active': !isActiveByName}"
      @click="$emit('active', 'by-alphabet')"
    >
      {{ $t('Alphabet search') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchTab',
  props: {
    activeTab: {
      type: String,
      required: false,
      default: 'by-name'
    }
  },
  computed: {
    isActiveByName () {
      return this.activeTab === 'by-name'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $mountain-meadow: color(mountain-meadow);
  $gray2: color(gray2);

  .tab-bar {
    width: 540px;
    height: 40px;
    .active {
      background-color: $mountain-meadow;
      color: white;
    }
  }
</style>
