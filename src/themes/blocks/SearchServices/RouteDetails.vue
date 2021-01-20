<template>
  <div class="navigation-list flex between-xs mb35">
    <template v-if="allInstructions && allInstructions.length > 0">
      <div class="custom-scroll">
        <p class="m0 weight-700 mb20 fs20 travel-time">
          {{ $t('Travel time') }} ≈ {{ travelTime }} {{ countMinutes }}
        </p>
        <div
          v-for="(instruction, i) in allInstructions"
          :key="i"
          class="navigation-item flex middle-xs mb31"
        >
          <div
            v-if="i === 0 || !instruction.image"
            class="image-wrapper flex middle-xs mr15"
          >
            <img
              :src="`/assets/map/${instruction.icon}`"
              width="60"
              height="60"
              alt="Route details"
            >
          </div>
          <div
            v-else
            class="image-wrapper flex middle-xs mr15"
          >
            <img
              :src="getImageLink(instruction.image)"
              width="60"
              height="60"
            >
          </div>
          <p class="description m0 fs20">
            {{ instruction.detail }}
          </p>
        </div>
        <div>
          <p class="mb20 fs16 lh19 weight-900">
            {{ $t('Send route to phone') }}
          </p>
          <p class="mt0 mb4 fs14">
            {{ $t('Receive by QR code') }}
          </p>
          <p class="mt0 mb4 fs14">
            ({{ $t('a route with a map will open in a browser window') }})
          </p>
          <div class="mb12">
            <no-ssr>
              <qrcode
                :value="qrUrl"
                :options="{ width: 176 }"
              />
            </no-ssr>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <p class="fs16 lh25 weight-700">
        {{ $t('Couldn\'t build a route') }}
      </p>
    </template>
  </div>
</template>

<script>
import RouteDetails from 'theme/mixins/RouteDetails/index.js'
import { getImageLink } from 'theme/helpers'
import { jsonBase64Encoder } from '@vue-storefront/theme-ingka-terminal/helpers'
import { mapState } from 'vuex'
import NoSSR from 'vue-no-ssr'

export default {
  name: 'RouteDetails',
  components: {
    'no-ssr': NoSSR
  },
  mixins: [RouteDetails],
  props: {
    qr: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      getImageLink
    }
  },
  computed: {
    qrUrl () {
      const encodedData = jsonBase64Encoder({
        mallId: this.activeMall.mallId,
        terminalId: this.activeMall.terminalId,
        fromObjectId: this.activePlaceID,
        language: this.$i18n.locale
      })
      return `${this.qrlink}/${encodedData}`
    },
    ...mapState({
      qrlink: state => state.config.qrlinks.publicMap,
      activeMall: state => state.config.activeMall,
      activePlaces: state => state.visioglobe.places.activePlaces,
      activePoi: state => state.visioglobe.places.activePoi
    }),
    activePlaceID () {
      if (this.activePlaces && this.activePlaces[0] && this.activePlaces[0].vg && this.activePlaces[0].vg.id) {
        return this.activePlaces[0].vg.id
      }
      if (this.activePoi && this.activePoi.options('id')) {
        return this.activePoi.options('id')
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .title {
    max-width: 169px;
  }
  .image-wrapper {
    width: 60px;
    height: 60px;
  }
  .description {
    max-width: 355px;
  }
  .qr-code {
    max-width: 199px;
    margin-right: -4px;
  }
</style>
