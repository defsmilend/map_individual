<template>
  <v-bottom-sheet
    inset
    :value="enabled"
    hide-overlay
    persistent
  >
    <v-card
      :class="['card-content', 'navigation', {btzoom : parameters.ui.modules.zoom}, {bottom: (parameters.ui.exploration.position === 'bottom')}, {compact: parameters.ui.exploration.compact}, 'vg-shifted']"
    >
      <v-card-text>
        <img
          :src="currentInstructionIcon"
          height="32"
          width="32"
        >
        {{ currentInstructionDetail }}
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat
          color="primary"
          :ripple="false"
          :disabled="navigation.currentInstructionIndex === 0"
          @click.stop="goToPreviousInstruction"
        >
          {{ parameters.locale.navigation.previous }}
        </v-btn>
        <v-btn
          flat
          color="primary"
          :ripple="false"
          :disabled="navigation.currentInstructionIndex === nbInstructions-1"
          @click.stop="goToNextInstruction"
        >
          {{ parameters.locale.navigation.next }}
        </v-btn>
        <v-btn
          flat
          color="primary"
          :ripple="false"
          @click.stop="clearRoute"
        >
          {{ parameters.locale.navigation.clear }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <div id="floorChangeTags" />
  </v-bottom-sheet>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('visioglobe', ['parameters']),
    ...mapState('visioglobe/route', ['navigation']),
    ...mapGetters('visioglobe/route', ['nbInstructions', 'currentInstructionIcon', 'currentInstructionDetail']),
    enabled: function () {
      return (this.navigation.enabled && this.navigation.currentNavigation !== null)
    }
  },
  methods: {
    ...mapActions('visioglobe/route', ['clearRoute']),
    ...mapMutations('visioglobe/route', ['setCurrentInstructionIndex']),
    goToPreviousInstruction: function () {
      this.navigation.currentNavigation.displayPrevInstruction()
      this.setCurrentInstructionIndex(this.navigation.currentNavigation.getCurrentInstructionIndex())
    },
    goToNextInstruction: function () {
      this.navigation.currentNavigation.displayNextInstruction()
      this.setCurrentInstructionIndex(this.navigation.currentNavigation.getCurrentInstructionIndex())
    }
  }
}
</script>

<style>
  #instructionIcon {
    width: "32px";
    height: "32px";
  }

  /* floor change label */
  .route_floorChange {
    width: 128px;
    height: 64px;
    background: transparent;
  }

  .route_floorChange > p {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 15px;
    color: #fff;
    line-height: 64px;
    left: 48px;
    position: absolute;
    width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
  }

  .route_floorChange > div {
    width: 32px;
    height: 32px;
    left: 12px;
    top: 16px;
    position: absolute;
    clip: rect(0px, 32px, 32px, 0px);
  }

  .route_floorChange > div > img.fcup {
    width: 32px;
    height: 32px;
    position: absolute;
    -webkit-animation-name: floorChangeUp; /* Safari 4.0 - 8.0 */
    -webkit-animation-duration: 2s; /* Safari 4.0 - 8.0 */
    animation-name: floorChangeUp;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  .route_floorChange > div > img.fcdown {
    width: 32px;
    height: 32px;
    position: absolute;
    -webkit-animation-name: floorChangeDown; /* Safari 4.0 - 8.0 */
    -webkit-animation-duration: 2s; /* Safari 4.0 - 8.0 */
    animation-name: floorChangeDown;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  /* Safari 4.0 - 8.0 */
  @-webkit-keyframes floorChangeUp {
    0% {
      bottom: 0px;
      opacity: 1;
    }
    25% {
      bottom: 0px;
      opacity: 1;
    }
    50% {
      bottom: 32px;
      opacity: 0;
    }
    51% {
      bottom: -32px;
      opacity: 0;
    }
    75% {
      bottom: 0px;
      opacity: 1;
    }
    100% {
      bottom: 0px;
      opacity: 1;
    }
  }

  /* Standard syntax */
  @keyframes floorChangeUp {
    0% {
      bottom: 0px;
      opacity: 1;
    }
    25% {
      bottom: 0px;
      opacity: 1;
    }
    50% {
      bottom: 32px;
      opacity: 0;
    }
    51% {
      bottom: -32px;
      opacity: 0;
    }
    75% {
      bottom: 0px;
      opacity: 1;
    }
    100% {
      bottom: 0px;
      opacity: 1;
    }
  }

  /* Safari 4.0 - 8.0 */
  @-webkit-keyframes floorChangeDown {
    0% {
      bottom: 0px;
      opacity: 1;
    }
    25% {
      bottom: 0px;
      opacity: 1;
    }
    50% {
      bottom: -32px;
      opacity: 0;
    }
    51% {
      bottom: 32px;
      opacity: 0;
    }
    75% {
      bottom: 0px;
      opacity: 1;
    }
    100% {
      bottom: 0px;
      opacity: 1;
    }
  }

  /* Standard syntax */
  @keyframes floorChangeDown {
    0% {
      bottom: 0px;
      opacity: 1;
    }
    25% {
      bottom: 0px;
      opacity: 1;
    }
    50% {
      bottom: -32px;
      opacity: 0;
    }
    51% {
      bottom: 32px;
      opacity: 0;
    }
    75% {
      bottom: 0px;
      opacity: 1;
    }
    100% {
      bottom: 0px;
      opacity: 1;
    }
  }

</style>
