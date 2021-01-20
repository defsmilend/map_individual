import Vue from 'vue'
// import { MutationTree } from 'vuex'

const mutations = {
  showRouteDescription (state, boolean) {
    state.isRouteDescription = boolean
  },
  showOnlyLogo (state, boolean) {
    state.isOnlyLogo = boolean
  },
  setMapIsLoaded (state, boolean) {
    state.isMapLoaded = boolean
  },
  setIsMapInserted (state, boolean) {
    state.isMapInserted = boolean
  },
  setServices (state, services) {
    Vue.set(state, 'services', services)
  },
  setSidebarServices (state, services) {
    Vue.set(state, 'sidebarServices', services)
  },
  setActiveService (state, service) {
    state.activeService = service
  },
  setMapPointsByService (state, { key, value, mapPoints }) {
    const service = state.services.find(el => el[key] === value)
    service.mapPoints = mapPoints
  },
  setSidebarMapPointsByService (state, { key, value, mapPoints }) {
    const { sidebarServices } = state
    if (!Array.isArray(sidebarServices)) return
    const service = sidebarServices.find(el => el[key] === value)
    service.mapPoints = mapPoints
  },
  setMapLoadingPromise (state, mapLoadingPromise) {
    state.mapLoadingPromise = mapLoadingPromise
  }
}

export default mutations
