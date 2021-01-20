<template>
  <v-toolbar class="absolute">
    <div class="exploration py10">
      <v-btn
        class="v-btn btn-reset-view absolute brdr-none bg-cl-white brdr-circle"
        @click.stop="goToTerminal"
      />
      <div class="floor">
        <v-btn-toggle
          v-if="!floors.length<2"
          v-model="currentFloorIndex"
          class="flex column"
          mandatory
        >
          <v-btn
            v-for="({level, value}, index) in floors"
            :key="index"
            flat
            small
            :ripple="false"
            class="weight-700 mb11 mr1 p0 brdr-none brdr-r-5 fs12 relative"
          >
            <points-counter :floor="value" />
            <span class="level">{{ level }}</span><br>{{ $t('floor') }}
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
  </v-toolbar>
</template>

<script>
import Vue from 'vue'
import PointsCounter from 'theme/components/theme/blocks/Map/components/PointsCounter'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Toolbar',
  components: {
    PointsCounter
  },
  computed: {
    ...mapState({
      mapviewer: state => state.visioglobe.mapviewer,
      parameters: state => state.visioglobe.parameters,
      multiBuildingView: state => state.visioglobe.multiBuildingView,
      byID: state => state.visioglobe.places.byID,
      terminalPOI: state => state.terminals.terminalPOI,
      currentBuildingID: state => state.visioglobe.venue.currentBuildingID,
      currentFloorID: state => state.visioglobe.venue.currentFloorID
    }),
    ...mapGetters('visioglobe/venue', ['floors']),
    currentFloor: {
      get: function () {
        return this.currentFloorID
      },
      set: function (floorID) {
        if (floorID !== this.currentFloorID) {
          this.goToFloor(floorID)
          this.setCurrentFloorID(floorID)
        }
      }
    },
    currentFloorIndex: {
      get: function () {
        return this.floors.findIndex(floor => (floor.value === this.currentFloorID))
      },
      set: function (floorIndex) {
        if (floorIndex !== undefined) {
          this.currentFloor = this.floors[floorIndex].value
        }
      }
    }
  },
  methods: {
    ...mapMutations('visioglobe/venue', ['setCurrentFloorID']),
    ...mapActions({
      goToFloor: 'visioglobe/venue/goToFloor'
    }),
    goToTerminal () {
      const position = this.terminalPOI.options('position')
      const floorID = this.terminalPOI.options('floor')
      this.multiBuildingView.goTo({
        mode: 'floor',
        floorID,
        viewpoint: {
          position
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~theme/css/variables/colors";
@import "~theme/css/helpers/functions/color";
@import "~theme/css/variables/_grid.scss";
$red: color(red);

  .v-toolbar {
    z-index: 2;
    right: 21px;
    bottom: 230px;
    .v-btn {
      background-color: white;
      width: 50px;
      height: 50px;
      padding: 0;
      &--active {
        background-color: $red;
        color: white;
      }
    }
  }

  .btn-reset-view {
    width: 50px;
    height: 50px;
    top: -210px;
    right: 2px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
    background : {
      image: url('/assets/icons/back_to_terminal.svg');
      repeat: no-repeat;
      position: center 55%;
      size: 65%;
    }
  }

  .v-btn-toggle button {
    font-family: inherit;
    .level {
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 2px;
    }
  }
</style>
