<template>
  <div
    :id="`bubble-logo-${id}`"
    class="bubble-logo brdr-r-5 p5 relative bg-cl-white"
  >
    <img
      :src="getImageLink(logoId)"
      alt="Логотип компании"
      width="45"
      height="45"
    >
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getImageLink } from '../../helpers'

export default {
  name: 'BubbleLogoPopup',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return { getImageLink }
  },
  computed: {
    ...mapState('visioglobe/places', ['byID']),
    logoId () {
      try {
        return this.byID[this.id].logo
      } catch (e) {
        return false
      }
    }
  },
  mounted () {
    this.$emit('popup-mounted')
  },
  beforeDestroy () {
    this.removeBubblePopup(this.id)
  },
  methods: {
    ...mapActions('visioglobe/places', ['removeBubblePopup'])
  }
}
</script>

<style lang="scss" scoped>
.bubble-logo {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
  &::before {
      content: '';
      display: block;
      position: absolute;
      bottom: -15px;
      z-index: 4;
      left: 50%;
      transform: translateX(-50%);
      border : {
        top: 20px solid white;
        left: 20px solid transparent;
        right: 20px solid transparent;
        bottom: none;
      }
    }
  img {
    object-fit: cover;
  }
}
</style>
