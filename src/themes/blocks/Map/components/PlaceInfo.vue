<template>
  <v-card
    :id="id"
    tile
    class="card-content placeinfo vg-shifted relative brdr-r-5"
    :class="{'visually-hidden': !placeID}"
  >
    <router-link
      :to="currentPlaceLink"
      tag="div"
      :class="{ 'disabled-link': !placeContent.companyID }"
    >
      <div class="flex cl-black">
        <img
          :src="getImageLink(placeLogo)"
          width="100"
          height="60"
        >
      </div>
    </router-link>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { getImageLink } from 'theme/helpers'

export default {
  props: {
    id: {
      type: String,
      default: 'card'
    }
  },
  data () {
    return {getImageLink}
  },
  computed: {
    ...mapState({
      parameters: state => state.visioglobe.parameters,
      activePlace: state => state.visioglobe.places.activePlace,
      mallObjects: state => state.mallObjects.mallObjects,
      isRouteDescription: state => state.map.isRouteDescription,
      isOnlyLogo: state => state.map.isOnlyLogo,
      byID: state => state.visioglobe.places.byID
    }),
    ...mapGetters('visioglobe/places', {
      placeID: 'activePlaceID',
      placeName: 'activePlaceName',
      placeDescription: 'activePlaceDescription',
      placeLogo: 'activePlaceLogo',
      placeContent: 'activePlaceContent'
    }),
    ...mapGetters('visioglobe/route', ['getAllInstructions']),
    isRouteExist () {
      const instructions = this.getAllInstructions
      return instructions && instructions.length > 0
    },
    currentPlaceLink () {
      if (this.activePlace) {
        const currentPlaceById = this.byID[this.activePlace.vg.id]
        const chosenCategory = this.$store.state.categories.categories.find(item => {
          if (item.name && currentPlaceById && currentPlaceById.name) {
            return item.name === currentPlaceById.name
          }
        })
        if (chosenCategory) {
          return `/search-services/${chosenCategory.code}`
        }
        return `/mall-object-page?types=${this.placeContent.typeId}&mallObject=${this.placeContent.companyID}`
      }
      return ''
    }
  },
  methods: {
    ...mapActions({
      setFrom: 'visioglobe/route/setFrom',
      addWaypoint: 'visioglobe/route/addWaypoint',
      setTo: 'visioglobe/route/setTo',
      resetActivePlace: 'visioglobe/places/resetActivePlace',
      showRouteDescription: 'map/showRouteDescription'
    }),
    hide: function () {
      this.resetActivePlace()
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-dialog__content {
    position: absolute;
    background: white;
    width: 400px;
    left: 29%;
    bottom: 0;
  }
  .card-content {
    background-color:white;
    padding: 5px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
    position: relative;
    max-width: 350px;
    font-family: Verdana, sans-serif;
    pointer-events: all !important;
    font-size: 14px;
    line-height: 16px;
    z-index: 1;
    &::before {
      content: '';
      display: block;
      position: absolute;
      bottom: -15px;
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
  .v-card__text {
    overflow-y: scroll;
    text-overflow: ellipsis;
    max-height: 200px;
  }
  .v-card__title {
    font-weight: 700;
    padding: 1px;
    max-width: 100px;
  }
  .route-description {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    top: 0;
    right: -128px;
    width: 100px;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.3);
    user-select: none;
    min-height: 32px;
  }
  .disabled-link {
    pointer-events: none;
  }
</style>
