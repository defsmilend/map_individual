<template>
  <div class="route-description bg-white pt20 pl30 pr40 border-box relative brdr-r-20">
    <div v-if="selectedPointLogo">
      <div class="mall_object_details">
        <div class="mall_object_logo">
          <img :src="getImageLink(selectedPointLogo)">
        </div>
        <div
          v-if="selectedPointCategories && selectedPointCategories.length"
          class="mall_object_categories"
        >
          <div
            v-for="(category, index) in selectedPointCategories"
            :key="index"
            class="mall_object_category"
          >
            {{ category }}
          </div>
        </div>
      </div>
    </div>
    <h2
      v-else
      class="fs24 lh29 title mt0 mb53"
    >
      {{ selectedPointName }}
    </h2>
    <route-details />
  </div>
</template>

<script>
import { getImageLink } from 'theme/helpers'
// theme/components/theme/blocks/RouteDetails.vue
import RouteDetails from '../../themes/blocks/RouteDetails'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'RouteDescription',
  components: {
    RouteDetails
  },
  data () {
    return {
      getImageLink
    }
  },
  computed: {
    ...mapGetters('visioglobe/places', ['activePlaceName', 'activePlaceContent']),
    selectedPointName () {
      let pointName = this.activePlaceName
      if (this.$store.state.visioglobe.places.activePoi) {
        pointName = this.$store.state.visioglobe.places.activePoi.title
      }
      return pointName
    },
    selectedPointLogo () {
      let mallObject = this.activePlaceContent
      return mallObject ? mallObject.logo : null
    },
    selectedPointCategories () {
      if (!this.activePlaceContent.categories && !this.activePlaceContent.categories.length) {
        return null
      }
      let categories = this.activePlaceContent.categories.filter(v => !v.hidden)
      return categories.map(v => v.name).splice(0, 5)
    }
  },
  beforeDestroy () {
    this.hideRouteDescription()
  },
  methods: {
    hideRouteDescription () {
      this.$store.dispatch('map/showRouteDescription', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.route-description {
  width: 655px;
  height: 680px;
  overflow: scroll;
}
.title {
  max-width: 550px;
}
.mall_object_details {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  .mall_object_logo {
    max-width: 30%;
    img {
      width: 100%;
    }
  }
  .mall_object_categories {
    display: flex;
    justify-content: center;
    flex-direction: column;
    .mall_object_category {
      margin: 7px 0;
      font-size: 16px;
      color: gray;
    }
  }
}
.route-description .navigation-list {
    & > div  {
      max-width: 315px;
    }
    .qr-code {
      max-width: 200px;
    }
    .travel-time, .description {
      font-size: 16px;
    }
    .travel-time {
      margin-bottom: 33px;
    }
  }
</style>
