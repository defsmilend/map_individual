<template>
  <div
    class="qr-code-app pt58 relative"
    :class="{'small-layout': isSmallLayout}"
    :style="{'background-image': `url('${backgroundImage}')`}"
  >
    <h1 class="fs24 lh30 weight-700 title mb30 pl17">
      {{ $t(title) }}
    </h1>
    <div class="flex relative">
      <div class="qr-code mr30">
        <no-ssr>
          <qrcode
            value="http://l.mega.ru/app"
            :options="{ width: widthQrCode }"
          />
        </no-ssr>
      </div>
      <div class="description-wrapper pt15">
        <div class="flex mb35 app-wrapper">
          <div class="app-store pl50 relative fs13 mr38 lh20">
            {{ $t('Download from') }}
            <br>
            <span class="fs29">App Store</span>
          </div>
          <div class="google-play pl54 relative fs13 lh20">
            {{ $t('Download from') }}
            <br>
            <span class="fs29">Google Play</span>
          </div>
        </div>
        <div class="description pr50">
          <p class="fs18 lh25 mb15 mt0 pl4">
            {{ $t('If you don’t have the opportunity to download the application to your smartphone, use the “Shopping light” service, having issued the passport of the buyer at the information desk') }}
          </p>
          <button-full
            class="item-button fs14 weight-700 relative"
            :link="{ path: 'search-services/information' }"
          >
            {{ $t('How to get to the information desk') }}
          </button-full>
        </div>
      </div>
    </div>
    <div class="absolute iphone-image">
      <img src="/assets/qrCodeApp/iphone.webp">
    </div>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'

export default {
  name: 'QrCodeApp',
  components: {
    'no-ssr': NoSSR,
    ButtonFull
  },
  props: {
    backgroundImage: {
      type: String,
      default: ''
    },
    isSmallLayout: {
      type: Boolean,
      defautl: false
    },
    title: {
      type: String,
      required: true
    }
  },
  computed: {
    widthQrCode () {
      return this.isSmallLayout ? 140 : 156
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $white: color(white);
  $gray5: color(gray5);

  .item-button /deep/ {
    .button-full {
      background: $white;
      z-index: 1;
    }
  }
  .title {
    max-width: 849px;
  }
  .description-wrapper {
    max-width: 487px;
  }
  .qr-code-app {
    background-repeat: no-repeat;
    padding-left: 98px;
    padding-bottom: 174px;
  }
  .app-store:after, .google-play:after {
    content: "";
    display: block;
    position: absolute;
    bottom: -5px;
    left: 5px;
    width: 40px;
    height: 48px;
    background-image: url("/assets/qrCodeApp/AppleLogo.webp");
    background-repeat: no-repeat;
  }
  .google-play:after {
    background-image: url("/assets/qrCodeApp/GooglePlayLogo.webp");
    bottom: -2px;
    left: -1px;
  }
  .iphone-image {
    bottom: -19%;
    right: 30px;
  }
  .small-layout {
    padding: 14px 138px 140px 31px;
    max-width: 530px;
    background-color: $gray5;
    border-radius: 20px;
    margin-bottom: 14px;
    .qr-code {
      margin-right: 14px;
    }
    .title {
      padding-left: 0;
      margin-bottom: 13px;
    }
    .iphone-image {
      position: fixed;
      width: 32%;
      bottom: 17.1%;
      right: -6%;
      img {
        width: 100%;
      }
    }
    .app-wrapper {
      flex-direction: column;
    }
    .app-store {
      margin-bottom: 24px;
    }
    .google-play {
      padding-left: 54px;
      &:after {
        left: 1px;
        bottom: -8px;
      }
    }
    .description-wrapper {
      height: 345px;
    }
    .description {
      position: absolute;
      bottom: -1px;
      left: 4px;
      padding-right: 72px;
    }
  }
</style>
