<template>
  <router-link
    tag="div"
    :to="getLink(object)"
    class="flex column no-underline link"
  >
    <div class="img-wrap bg-cl-gray2">
      <img
        :src="getObjectImg(object)"
        :alt="object.name"
        class="main-image mw-100 brdr-r-top-left-5 brdr-r-top-right-5"
      >
    </div>
    <div class="object-name-wrap pb15 pt17 px30 bg-cl-gray2 relative border-box  brdr-r-bottom-left-5 brdr-r-bottom-right-5">
      <img
        :src="getObjectLogo(object)"
        alt=""
        class="logo absolute"
      >
      <p class="object-name m0 cl-black fs18 lh20 weight-700">
        {{ object.name }}
      </p>
      <p class="p0 m0 fs14 weight-400">
        {{ object.type.name }}
      </p>
    </div>
  </router-link>
</template>

<script>
import { getImageLink } from 'theme/helpers'

export default {
  name: 'ObjectList',
  props: {
    object: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      getImageLink
    }
  },
  methods: {
    getLink (object) {
      return `/mall-object-page?mallObject=${object.id}`
    },
    getObjectImg (object) {
      return object.images && object.images.length ? getImageLink(object.images[0].id) : '/assets/placeholder.png'
    },
    getObjectLogo (object) {
      return object.company && object.company.images && object.company.images.length ? getImageLink(object.company.images[0].id) : '/assets/placeholder.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.img-wrap {
  height: 150px;
}
.main-image {
  height: 155px;
  object-fit: cover;
}
.object-name-wrap {
  height: 105px;
}
.object-name {
  flex-grow: 1;
}
.link {
  height: 255px;
}
.logo {
  width: 50px;
  height: 50px;
  top: -40px;
  left: 30px;
  border: none;
  object-fit: cover;
  border-radius: unset;
}
</style>
