<template>
  <router-link
    tag="div"
    :to="generateItemLink({item})"
    class="link-tile flex middle-xs between-xs w-100"
  >
    <div class="flex middle-xs">
      <img
        :src="getLogoImage(item.image_id)"
        class="w-100 image mr40"
      >
      <div class="fs16 lh16 weight-700 mb3">
        {{ item.name }}
      </div>
    </div>
    <div class="arrow-inner brdr-top-3 brdr-right-3" />
  </router-link>
</template>

<script>
import { getImageLink, generateItemLink, getPlaceholder } from 'theme/helpers'
import { mapState } from 'vuex'

export default {
  name: 'LinkTile',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      getImageLink,
      generateItemLink
    }
  },
  computed: {
    ...mapState({
      config: state => state.config
    })
  },
  methods: {
    getLogoImage (id) {
      const type = 'service-logo'
      return id ? getImageLink(id) : getPlaceholder(type)
    }
  }
}
</script>

<style scoped lang="scss">
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $black: color(black);

  .link-tile {
    height: 108px;
  }
  .image {
    width: 64px;
  }
  .arrow-inner {
    transform: rotate(45deg);
    height: 15px;
    width: 15px;
    background: transparent;
  }
</style>
