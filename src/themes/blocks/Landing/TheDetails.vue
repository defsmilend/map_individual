<template>
  <div
    v-lazy:background-image="'/assets/MegaFriends/theDetails.webp'"
    class="details-block pt67 align-center pr56 pb46"
  >
    <h2 class="fs40 weight-700 mb32 mt42 pr53">
      Узнай подробности на mega.ru<br>или в приложении МЕГА
    </h2>
    <div class="flex center-xs">
      <div class="qr-code mr30">
        <no-ssr>
          <qrcode
            value="http://l.mega.ru/app"
            :options="{ width: 156 }"
          />
        </no-ssr>
      </div>
      <div class="align-left">
        <p class="fs35 lh45  mt9">
          Отсканируй QR-код<br>или скачай приложение<br>в
          <span class="app-store pl61 relative">AppStore</span>
          <span class="google-play pl61 relative">GooglePlay</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr'

export default {
  name: 'TheDetails',
  components: {
    'no-ssr': NoSSR
  }
}
</script>

<style lang="scss" scoped>
  .details-block {
    height: 503px;
    background-repeat: no-repeat;
    background-position: 50% 0;
    background-size: 82%;
  }
  .app-store:after, .google-play:after {
    content: "";
    display: block;
    position: absolute;
    bottom: -1px;
    left: 11px;
    width: 40px;
    height: 44px;
    background-image: url("/assets/MegaFriends/AppStore.webp");
    background-repeat: no-repeat;
  }
  .google-play:after {
    background-image: url("/assets/MegaFriends/GooglePlay.webp");
    bottom: -8px;
  }
  .qr-code {
    margin-left: 11%;
  }
</style>
