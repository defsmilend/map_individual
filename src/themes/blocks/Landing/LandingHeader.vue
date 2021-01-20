<template>
  <div
    class="landing-header pt62 flex between-xs"
    :style="{'background-image': `url('${backgroundImage}')`}"
  >
    <div>
      <div
        class="back-link flex middle-xs ml lh24 fs20 pointer weight-700 pl50 mb59"
        @click="goBack"
      >
        <div
          v-lazy:background-image="'/assets/icons/back_arrow.svg'"
          class="img mr20"
        />
        {{ backTitle }}
      </div>
      <div class="ml55">
        <h1 class="m0 ml40 fs40 weight-700">
          {{ title }}
        </h1>
        <p
          class="fs35 ml40 lh45 description"
          v-html="description"
        />
      </div>
    </div>
    <div>
      <p class="m0 fs20 mr30 mt40 cl-black work-time">
        {{ $t('MEGA is open until') }} {{ megaWorkTime }}
      </p>
    </div>
  </div>
</template>

<script>
import Header from 'theme/mixins/Header/index.js'

export default {
  name: 'LandingHeader',
  mixins: [Header],
  props: {
    backgroundImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .landing-header {
    background-size: cover;
    background-repeat: no-repeat;
    height: 351px;
    width: 1920px;
    transition: all .2s linear;
  }
  .back-link, .description, .work-time {
    transition-property: height, margin-bottom, opacity;
    transition-duration: .2s;
    transition-timing-function: linear;
  }
  .img {
    width: 23px;
    height: 30px;
    background-size: cover;
  }
  .work-time {
    opacity: 0;
  }
</style>
