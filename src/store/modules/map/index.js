// import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export const map = {
  namespaced: true,
  state: {
    isRouteDescription: false,
    isOnlyLogo: false,
    isMapLoaded: false,
    mapLoadingPromise: null,
    isMapInserted: false,
    services: [],
    activeService: null
  },
  actions,
  mutations,
  getters
}
