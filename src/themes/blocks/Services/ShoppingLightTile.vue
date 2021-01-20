<template>
  <div
    class="item w-100 flex column middle-xs mr30 pt20"
    :class="size"
    :style="{'background-image': `url('${image}')`}"
  >
    <div class="flex fs16 lh25 relative">
      <h1 class="m0 weight-700 fs86 absolute number">
        {{ number }}
      </h1>
      <div class="description">
        <div
          class="m0 fs16 ml35"
          v-html="description"
        />
      </div>
    </div>
    <template v-if="isShovButton">
      <button-full
        class="item-button"
        :link="{ path: button.link }"
      >
        {{ button.name }}
      </button-full>
    </template>
  </div>
</template>

<script>
import ButtonFull from 'theme/components/theme/ButtonFull.vue'

export default {
  name: 'ShoppingLightTile',
  components: { ButtonFull },
  props: {
    number: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    button: {
      type: Object,
      default: null
    },
    backgroundImage: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  },
  computed: {
    isShovButton () {
      return this.button && this.button.name
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $white: color(white);

  .item-button /deep/ {
    .button-full {
      background: $white;
    }
  }
  .item {
    background-position: top;
    background-repeat: no-repeat;
  }
  .description {
    height: 400px;
  }
  .number {
    left: -33px;
    top: 23px;
  }
  .small {
    width: 330px;
    .description {
      max-width: 255px;
      min-width: 255px;
    }
  }
  .middle {
    width: 420px;
    .description {
      max-width: 265px;
      min-width: 265px;
    }
  }
  .big {
    width: 533px;
    .description {
      max-width: 390px;
      min-width: 390px;
    }
  }
</style>
