<template>
  <div class="side-bar flex column scroll-area">
    <div
      v-for="(vehicle, key) in vehiclesSort"
      :key="key"
    >
      <h3 class="fs16 weight-700 mb10 mt0">
        {{ vehicle.title }}
      </h3>
      <div
        v-for="(route, index) in routes"
        :key="index"
      >
        <template v-if="route.vehicle_id === vehicle.id">
          <div
            class="bg-cl-white-smoke pl30 py22 brdr-r-5 mb20 weight-700 fs16 pointer"
            :class="{'active': currentRoute && Number(currentRoute.id) === Number(route.id)}"
            :data-content="route.name"
            @click="goToRoute(route.id)"
          >
            № {{ route.name }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SidebarRoutes',
  props: {
    vehicles: {
      type: Array,
      required: true
    },
    routes: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState({
      currentRoute: state => state.routes.route
    }),
    vehiclesSort () {
      let vehiclesSort = []
      this.vehicles.forEach(vehicle => {
        let foundRoute = this.routes.find(route => vehicle.id === route.vehicle_id)
        if (foundRoute) {
          vehiclesSort.push({
            title: vehicle.name,
            id: vehicle.id
          })
        }
      })
      return vehiclesSort
    }
  },
  methods: {
    goToRoute (id) {
      this.$emit('go-to-route-id', id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-pacific-blue: color(pacific-blue);

.side-bar {
  width: 270px;
  height: 678px;
}
.active {
  background: $color-pacific-blue;
}
</style>
