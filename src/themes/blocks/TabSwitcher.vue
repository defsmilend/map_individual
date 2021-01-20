<template>
  <div class="tab-switcher brdr-r-40">
    <div class="flex center-xs">
      <button-full
        class="tab-button brdr-r-40"
        :background="activeTab === 'route' ? 'blue ': 'white'"
        :title="$t('Route')"
        :class="isHiddenTab || true ? 'long-btn' : 'short-btn'"
        @click="$emit('set-active-tab', 'route')"
      />
      <button-full
        class="tab-button brdr-r-40"
        :background="activeTab === 'description' ? 'blue ': 'white'"
        :title="$t('Description')"
        :class="isHiddenTab || true ? 'long-btn' : 'short-btn'"
        @click="$emit('set-active-tab', 'description')"
      />
      <!--      <button-full-->
      <!--        v-if="!isHiddenTab"-->
      <!--        class="tab-button brdr-r-40 short-btn"-->
      <!--        :background="activeTab === 'photo' ? 'blue ': 'white'"-->
      <!--        :title="$t('Photo')"-->
      <!--        @click="$emit('set-active-tab', 'photo')"-->
      <!--      />-->
    </div>
  </div>
</template>

<script>
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { mapState } from 'vuex'

export default {
  name: 'TabSwitcher',
  components: {
    ButtonFull
  },
  props: {
    activeTab: {
      type: String,
      required: true
    },
    isHiddenTab: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-white: color(white);

.tab-switcher {
  width: min-content;
  margin: 0 auto;
  background: $color-white;
  overflow: hidden;
  transform: translateY(-50%);

  .long-btn /deep/ .button-full {
    width: 365px;
  }

  .short-btn /deep/ .button-full {
    width: 241px;
  }

  .tab-button /deep/ .button-full {
    display: inline-block;
    height: 45px;
    font-size: 17px;
    font-weight: 700;
  }
}

</style>
