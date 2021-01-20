<template>
  <router-link
    tag="div"
    :to="link"
    class="flex column no-underline link"
  >
    <img
      :src="getImg()"
      :alt="title"
      class="mw-100 brdr-r-top-left-5 brdr-r-top-right-5"
    >
    <p class="category-name m0 pb10 pt15 px22 cl-black fs18 lh20 bg-cl-gray2 weight-700 relative border-box brdr-r-bottom-left-5 brdr-r-bottom-right-5">
      {{ title }}
    </p>
  </router-link>
</template>

<script>
import { getImageLink } from 'theme/helpers'

export default {
  name: 'LinkTile',
  props: {
    link: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    imageId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    getImg () {
      return getImageLink(this.imageId)
    }
  }
}
</script>

<style lang="scss" scoped>
  img {
    height: 150px;
    object-fit: cover;
  }
  .category-name {
    height: 66px;
    flex-grow: 1;
  }
  .category-count {
    top: 10px;
    right: 10px;
  }
  .link {
    height: 255px;
  }
</style>
