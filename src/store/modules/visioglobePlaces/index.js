import Vue from 'vue'
import Vuex from 'vuex'
import places from './places'
import venue from './venue'
import route from './route'
import { state, mutations, actions } from './root';

Vue.use(Vuex)

export default {
  namespaced: true,
  modules: {
    places,
    venue,
    route
  },
  state,
  mutations,
  actions
}
