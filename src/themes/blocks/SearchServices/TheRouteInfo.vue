<template>
  <section
    class="route-info ml55 mr50 scroll-area brdr-r-25 px30 pt20 bg-cl-gray2"
    :class="{'route-info-absolute': selectedSearchPoi || mallObject }"
  >
    <div
      v-if="selectedSearchPoi || mallObject"
      class="cancel-button pointer pt2"
      @click="hideRouteDescription"
    >
      <span class="pl40 fs20 lh24">Вернуться к карте</span>
    </div>
    <div
      v-if="currentChosenObject"
    >
      <h2
        class="fs24 lh29 title mt0"
        :data-content="currentChosenObject.name"
      >
        {{ currentChosenObject.name }}
      </h2>
      <template v-if="currentChosenObject.work_time.length">
        <p class="mt0 fs16 lh25 weight-700">
          {{ $t('Working hours') }}:
        </p>
        <p>{{ currentChosenObject.work_time | parseWorkTime }}</p>
      </template>
      <div
        v-if="currentChosenObject.description"
        class="mb30"
      >
        <p class="fs16 lh25 mb0">
          {{ currentObjectDescription }}
        </p>
        <div
          v-if="currentChosenObject.description.length > 103"
          @click="toggleTextDescription"
        >
          <span class="fs16 lh25 cl-blue4">{{ descriptionOpened ? 'Скрыть' : 'Подробнее' }}</span>
        </div>
      </div>
      <route-details />
    </div>
    <p
      v-else
      class="fs16 lh25 weight-700"
    >
      {{ $t('Couldn\'t build a route') }}
    </p>
  </section>
</template>

<script>
import RouteDetails from 'theme/components/theme/blocks/SearchServices/RouteDetails'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'RouteInfo',
  components: {
    RouteDetails
  },
  filters: {
    parseWorkTime (workTime) {
      const workingHours = workTime.find(el => el.work)
      return `${workingHours.work.from} — ${workingHours.work.to}`
    }
  },
  props: {
    category: {
      type: Object,
      required: false,
      default: null
    },
    selectedSearchPoi: {
      type: Object,
      required: false,
      default: null
    },
    mallObject: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      descriptionLength: 103,
      descriptionOpened: false
    }
  },
  computed: {
    ...mapState({
      mapLoadingPromise: state => state.map.mapLoadingPromise
    }),
    currentChosenObject () {
      if (this.mallObject) {
        return this.mallObject
      }
      if (this.selectedSearchPoi) {
        return this.category.mapPoints.find(el => this.selectedSearchPoi.placeId === el.visioglobe_id)
      }
      if (this.category) {
        return this.category.mapPoints[0]
      }
      return null
    },
    currentObjectDescription () {
      const cuttedDesc = this.currentChosenObject.description.slice(0, this.descriptionLength)
      return this.descriptionLength < this.currentChosenObject.description.length ? `${cuttedDesc}...` : cuttedDesc
    }
  },
  methods: {
    ...mapActions({
      setActiveMapPoint: 'map/setActiveMapPoint',
      showRouteDescription: 'map/showRouteDescription'
    }),
    hideRouteDescription () {
      this.showRouteDescription(false)
    },
    toggleTextDescription () {
      this.descriptionOpened = !this.descriptionOpened
      this.descriptionLength = this.descriptionOpened ? this.currentChosenObject.description.length : 103
    }
  }
}
</script>

<style lang="scss" scoped>
.route-info {
  width: 455px;
}
.route-info-absolute {
  position: absolute;
  left: 27%;
  z-index: 2;
}
.cancel-button {
  height: 35px;
  background: url('/assets/svg/BackArrow.svg') no-repeat;
}
.route-info /deep/ {
  .travel-time {
    font-size: 16px;
    line-height: 25px;
  }
  .navigation-list {
    margin: 0;
  }
  .navigation-item .description {
    font-size: 14px;
  }
}
.scroll-area {
  height: 660px;
}
</style>
