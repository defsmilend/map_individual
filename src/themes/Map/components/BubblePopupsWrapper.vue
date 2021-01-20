<template>
  <div v-show="false">
    <place-info
      id="bubble"
      key="#bubble"
    />
    <!-- <template v-for="place in nearPlacesOnRoute">
      <bubble-logo-popup
        v-if="place && place.id && place.id !== activePlaceId"
        :id="place.id"
        :key="place.id"
        @popup-mounted="createRoutePopup(place.id)"
      />
    </template> -->
  </div>
</template>

<script>
import PlaceInfo from './PlaceInfo'
// import BubbleLogoPopup from './BubbleLogoPopup'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'BubblePopupsWrapper',
  components: {
    PlaceInfo
    // BubbleLogoPopup
  },
  computed: {
    ...mapState('map', ['isRouteDescription']),
    ...mapState('visioglobe/places', ['bubblePopups', 'activePlace']),
    ...mapGetters('visioglobe/route', ['getAllInstructions']),
    /* nearPlacesOnRoute () {
      try {
        if (this.getAllInstructions.length > 2 && this.isRouteDescription) {
          const interimSteps = this.getAllInstructions.slice(1, this.getAllInstructions.length - 1)
          return interimSteps
            .map(step => step.nearPlaces[0])
            .filter(place => place && place.id)
        }
      } catch (e) {
        return []
      }
      return []
    }, */
    activePlaceId () {
      return this.activePlace && this.activePlace.vg && this.activePlace.vg.id
    }
  },
  methods: {
    /* ...mapActions('visioglobe/places', ['createBubblePopup', 'removeBubblePopup']),
    createRoutePopup (placeId) {
      if (this.nearPlacesOnRoute.find(place => place && place.id === placeId)) {
        this.createBubblePopup({
          placeId,
          selector: `#bubble-logo-${placeId}`
        })
      }
    } */
  }
}
</script>

<style>
</style>
