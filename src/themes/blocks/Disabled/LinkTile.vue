<template>
  <div
    class="link-tile bg-cl-gray2 brdr-r-bottom-10"
    :class="{'x-layout flex middle-sm brdr-r-10': isXLayout}"
    :style="{'width': `${width}px`}"
    :data-submenu-button="'Ссылка: ' + item.title"
    @click="generateLink()"
  >
    <div class="image-wrapper mb48">
      <img :src="currentTileImage">
    </div>
    <div class="title fs18 lh20 px30 weight-700">
      {{ item.title }}
    </div>
  </div>
</template>

<script>
import { getImageLink, generateMenuLink, getPlaceholder } from 'theme/helpers'
import { mapState } from 'vuex'

export default {
  name: 'LinkTile',
  props: {
    item: {
      type: Object,
      required: true
    },
    isXLayout: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 212
    }
  },
  data () {
    return {
      getImageLink,
      generateMenuLink
    }
  },
  computed: {
    ...mapState({
      config: state => state.config
    }),
    currentTileImage () {
      const currentImageId = this.item.image_id || 0
      if (!currentImageId && this.item.image) {
        return this.item.image
      }
      return this.currentImage(currentImageId)
    }
  },
  methods: {
    currentImage (id) {
      const type = 'disabled'
      return id ? getImageLink(id) : getPlaceholder(type)
    },
    generateLink () {
      this.$store.dispatch('routeNavigate/setCurrentTitle', { title: this.item.title, isBig: false })
      this.$router.push(this.generateMenuLink({ item: this.item }))
    }
  }
}
</script>

<style scoped lang="scss">
  .link-tile {
    height: 255px;
  }
  .image-wrapper {
    max-width: 100%;
    height: 119px;
    text-align: center;
    img {
      max-width: inherit;
    }
  }
  .title {
    height: 136px;
  }
  .x-layout {
    height: 200px;
    .image-wrapper {
      margin-left: 27px;
      margin-bottom: 0;
    }
    .title {
      width: 340px;
      display: flex;
      align-items: center;
      font-size: 26px;
      line-height: 31px;
    }
  }
</style>
