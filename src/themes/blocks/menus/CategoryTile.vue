<template>
  <div
    class="flex column no-underline link"
    @click="generateLink()"
  >
    <div class="category-tile-image-wrapper">
      <img
        :src="getCategoryImg()"
        :alt="title"
        class="mw-100 brdr-r-top-left-5 brdr-r-top-right-5"
      >
    </div>
    <p class="category-name m0 pb10 pt15 px22 cl-black fs18 lh20 bg-cl-gray2 weight-700 relative border-box brdr-r-bottom-left-5 brdr-r-bottom-right-5">
      {{ title }}
      <span
        v-if="showTotal"
        class="category-count absolute cl-gray6 weight-700 fs12 lh15"
      >{{ categoriesTotal }}</span>
    </p>
  </div>
</template>

<script>
import { getImageLink, generateMenuLink } from 'theme/helpers'
import { mapState } from 'vuex'

export default {
  name: 'CategoryTile',
  props: {
    categories: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    imageId: {
      type: Number,
      default: 0
    },
    showTotal: {
      type: Boolean,
      default: false
    },
    submenuId: {
      type: Number,
      default: 0
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
      mallId: state => state.config.activeMall.mallId,
      config: state => state.config
    }),
    categoriesIds () {
      return this.categories.map(category => category.id)
    },
    categoriesTypes () {
      let types = []
      this.categories.forEach(category => {
        let mallInformation = category.mall_information.find(item => Number(item.mall_id) && Number(item.mall_id) === Number(this.mallId))
        if (mallInformation) {
          types = types.concat(mallInformation.types)
        }
      })
      return Array.from(new Set(types)).filter(v => !!v)
    },
    categoriesTotal () {
      let count = 0
      this.categories.forEach(category => {
        let mallInformation = category.mall_information.find(item => Number(item.mall_id) && Number(item.mall_id) === Number(this.mallId))
        if (mallInformation && Number(mallInformation.count)) {
          count += Number(mallInformation.count)
        }
      })
      return count
    },
    currentSlug () {
      return this.$route.params.slug || this.$route.matched[0].props.default.slug
    },
    placeholderImage () {
      return this.config.placeholders[this.currentSlug] ? this.config.placeholders[this.currentSlug].placeholderImg : this.config.placeholders.default.placeholderImg
    }
  },
  methods: {
    getCategoryImg () {
      return this.imageId ? getImageLink(this.imageId) : this.placeholderImage
    },
    generateLink () {
      this.$store.dispatch('routeNavigate/setCurrentTitle', { title: this.title, isBig: false })
      const item = { categoriesList: this.categories }
      const types = this.categoriesTypes.join(',')
      const submenuId = this.submenuId
      this.$router.push(generateMenuLink({ item, types, submenuId }))
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  height: 150px;
  object-fit: cover;
  width: 100%;
}
.category-tile-image-wrapper {
  text-align: center;
  height: 150px;
}
.category-name {
  min-height: 65px;
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
