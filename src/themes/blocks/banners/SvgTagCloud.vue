<template>
  <div class="bg-cl-black svg-tag-cloud">
    <div id="svg-tag-cloud" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getImageLink, generateItemLink } from 'theme/helpers'

export default {
  name: 'SvgTagCloud',
  data () {
    return {
      svg3DTagCloud: [],
      settings: {
        entries: [],
        width: 1920,
        height: 960,
        radius: '60%',
        radiusMin: 50,
        bgDraw: true,
        bgColor: '#000',
        opacityOver: 0.2,
        opacityOut: 0,
        opacitySpeed: 1,
        fov: 800,
        speed: 0.5
      },
      companyids: []
    }
  },
  computed: {
    ...mapState({
      tagsCloud: state => state.banners.tagsCloud,
      activeTagsCloudLink: state => state.banners.activeTagsCloudLink
    })
  },
  watch: {
    'activeTagsCloudLink': 'goToApoints'
  },
  async beforeMount () {
  },
  mounted () {
    this.loadTags()
  },
  beforeDestroy () {
    this.svg3DTagCloud = null
    window.requestAnimFrame = null
  },
  methods: {
    goToApoints () {
      this.$router.push(this.activeTagsCloudLink)
    },
    loadSvg3DTagsCloud (tagsCloud) {
      if (window !== 'undefined' && window.SVG3DTagCloud) {
        this.settings.entries = tagsCloud || this.tagsCloud
        const SVG3DTagCloud = window.SVG3DTagCloud
        this.svg3DTagCloud = new SVG3DTagCloud(document.getElementById('svg-tag-cloud'), this.settings)
      }
    },
    async loadTags () {
      if (this.tagsCloud && this.tagsCloud.length) {
        this.loadSvg3DTagsCloud()
        return
      }

      await this.$store.dispatch('mallObjects/loadMallObjects', {}).then(async mallObjects => {
        if (!mallObjects || (mallObjects && !mallObjects.length)) return

        let tagsCloud = []
        for (const mall of mallObjects) {
          const imageId = await this.logoImageId(mall.company)
          if (imageId) {
            const link = await generateItemLink({item: mall})
            await tagsCloud.push({
              image: getImageLink(imageId),
              width: '50',
              height: '50',
              url: link
            })
          }
        }
        this.loadSvg3DTagsCloud(tagsCloud)
        this.$store.dispatch('banners/setTagsCloud', tagsCloud)
      })
    },
    logoImageId (company) {
      if (company && Array.isArray(company.images)) {
        if (this.companyids.some(id => id === company.id)) return

        this.companyids.push(company.id)
        return this.imageId(company.images)
      }
      return null
    },
    imageId (imageArr) {
      let imageObj = imageArr.find(image => image.id)
      return imageObj ? imageObj.id : null
    }
  }
}
</script>

<style lang="scss" scoped>
  .svg-tag-cloud {
    padding-bottom: 117px;
  }
</style>
