
<template>
  <div
    class="mall-object-details"
    :data-content="mallObject.name"
  >
    <div class="container-background relative">
      <div
        class="main-image absolute"
        :style="`background-image: url(${getBgImage()});`"
        :class="{contain: !backImageId}"
      >
        <img
          class="logo-img block absolute"
          :src="getLogoImage()"
          alt=""
        >
      </div>
    </div>
    <tab-switcher
      :active-tab="activeTab"
      :is-hidden-tab="isCarsharing"
      @set-active-tab="setActiveTab"
    />
    <div class="tab-content px34 m10 relative">
      <div
        v-if="activeTab === 'description'"
        class="description"
      >
        <mall-object-description :mall-object="mallObject" />
      </div>
      <div
        v-if="activeTab === 'route'"
        class="route"
      >
        <route-details />
      </div>
      <div
        v-if="activeTab === 'photo'"
        class="photo"
      >
        <div class="gallery brdr-r-5 flex w-100 mt15 between-xs">
          <img
            v-for="image in mallObject.images"
            :key="image.id"
            class="gallery-image mb16 block"
            :src="getImageLink(image.id)"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import MallObjectModel from 'theme/components/theme/MallObjectModel'
import MallObjectDescription from 'theme/components/theme/blocks/mallObject/MallObjectDescription.vue'
import RouteDetails from 'theme/components/theme/blocks/RouteDetails.vue'
import TabSwitcher from 'theme/components/theme/blocks/TabSwitcher.vue'
import { getImageLink, getPlaceholder } from 'theme/helpers'

export default {
  name: 'MallObjectDetails',
  components: {
    MallObjectDescription,
    TabSwitcher,
    RouteDetails
  },
  mixins: [
    MallObjectModel,
    MallObjectDescription
  ],
  props: {
    mallObject: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      getImageLink
    }
  },
  computed: {
    ...mapState({
      carsharing: state => state.config.carsharing,
      config: state => state.config
    }),
    isCarsharing () {
      return this.mallObject.categories.some(v => String(v.id) === String(this.carsharing.categoryId))
    },
    activeTab () {
      return this.$route.query.activeTab || 'route'
    },
    backImageId () {
      if (Array.isArray(this.mallObject.images)) {
        return this.imageId(this.mallObject.images)
      }
      return null
    },
    company () {
      return this.mallObject.company || null
    },
    logoImageId () {
      if (this.company && Array.isArray(this.company.images)) {
        return this.imageId(this.company.images)
      }
      return null
    }
  },
  beforeMount () {
    this.setClickCondition(false)
  },
  beforeDestroy () {
    this.setClickCondition(true)
  },
  methods: {
    ...mapActions('visioglobe', ['setClickCondition']),
    getBgImage () {
      const type = 'mall-object-bg'
      return this.backImageId ? getImageLink(this.backImageId) : getPlaceholder(type)
    },
    getLogoImage () {
      const type = 'mall-object-logo'
      return this.logoImageId ? getImageLink(this.logoImageId) : getPlaceholder(type)
    },
    setActiveTab (tabName) {
      const currentRoute = this.$route
      this.$router.push({
        path: currentRoute.params.catalogType,
        query: Object.assign({}, currentRoute.query, {
          activeTab: tabName
        }),
        params: currentRoute.params
      })
    },
    imageId (imageArr) {
      let imageObj = imageArr.find(image => image.id)
      return imageObj ? imageObj.id : null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-white-smoke: color(white-smoke);
$color-pacific-blue: color(pacific-blue);
$color-white: color(white);

.container-background {
  height: 313px;
}
.mall-object-details {
  height: auto;
  min-height: 100%;
  .logo-img {
    width: 100px;
    height: 100px;
    left: 40px;
    top: 93px;
  }

  .main-image {
    top: 0;
    left: 0;
    width: 100%;
    height: 455px;
    background-position: 50% -2px;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: inset 0px -187px 96px -71px $color-white-smoke,
    inset 0px -35px 17px -30px $color-white-smoke;
  }
  .contain {
    background-size: contain;
  }
  .tab-content {
    z-index: 1;
    .gallery {
      overflow: hidden;
      flex-wrap: wrap;
      &-image {
        object-fit: cover;
        width: 350px;
        height: 264px;
      }
    }
  }
}
</style>
