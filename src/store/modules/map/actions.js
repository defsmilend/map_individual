// import { ActionTree } from 'vuex'

const actions= {
  showRouteDescription ({ commit }, boolean) {
    commit('showRouteDescription', boolean)
  },
  showOnlyLogo ({ commit }, boolean) {
    commit('showOnlyLogo', boolean)
  },
  setMapIsLoaded ({ commit }, boolean) {
    commit('setMapIsLoaded', boolean)
  },
  insertMap ({ commit, state, dispatch }) {
    if (!state.isMapInserted) {
      const map = document.querySelector('#map')
      const mapContainer = document.querySelector('#map-container')
      if (mapContainer) {
        mapContainer.appendChild(map)
        commit('setIsMapInserted', true)
        dispatch('visioglobe/route/removeNearPlaceFromMap', { }, { root: true })
        commit('showRouteDescription', false)
        if (state.isMapLoaded) dispatch('visioglobe/onResize', null, { root: true })
        return Promise.resolve()
      } else return Promise.reject('A map container is undefined.')
    } else return Promise.reject('The map is inserted already.')
  },
  extractMap ({ commit, dispatch }) {
    const map = document.querySelector('#map')
    const layout = document.querySelector('#hidden-map-container')
    layout.appendChild(map)
    commit('setIsMapInserted', false)
    dispatch('visioglobe/setInitialStateOfMap', null, { root: true })
  },
  setMapPointsByService ({ commit, state }, { key = 'code', value, mapPoints }) {
    commit('setMapPointsByService', { key, value, mapPoints })
    return Promise.resolve()
  },
  setSidebarMapPointsByService ({ commit, state }, { key = 'code', value, mapPoints }) {
    commit('setSidebarMapPointsByService', { key, value, mapPoints })
  },
  setServices ({ commit, state }, services) {
    commit('setServices', services)
    return Promise.resolve(state.services)
  },
  setSidebarServices ({ commit, state }, services) {
    commit('setSidebarServices', services)
    return Promise.resolve(state.sidebarServices)
  },
  setMapLoadingPromise ({ commit }, mapLoadingPromise) {
    commit('setMapLoadingPromise', mapLoadingPromise)
  },
  async setActiveMapPoint ({ state, rootState, dispatch },
    { mapPoint, visioglobe_id, isDisplayRoute, poiColor, poiGroup = false }) {
    if (!visioglobe_id && !mapPoint) {
      if (isDisplayRoute) return Promise.reject('Required parameters are not passed (visioglobe_id or mapPoint)')
      return
    }

    if (!mapPoint) {
      await state.mapLoadingPromise
      const { getPlace, getPOI } = rootState.visioglobe.mapviewer
      mapPoint = getPlace(visioglobe_id) || getPOI(visioglobe_id)
      if (!mapPoint) {
        if (isDisplayRoute) return Promise.reject('Required parameters are not passed (visioglobe_id or mapPoint)')
        return
      }
    }

    if (Array.isArray(mapPoint)) {
      mapPoint.forEach(poi => {
        poi.group = poiGroup
        dispatch('visioglobe/places/addActiveMapPoi', { poi, color: poiColor }, { root: true })
        if (isDisplayRoute) dispatch('visioglobe/route/setToPoi', { poi }, { root: true })
      })
    } else {
      dispatch('visioglobe/places/paintPlace', { place: mapPoint }, { root: true })
      if (isDisplayRoute) dispatch('visioglobe/route/setTo', { id: mapPoint.vg.id }, { root: true })
    }

    return mapPoint
  },
  setActiveService ({ commit }, service) {
    commit('setActiveService', service)
  }
}
export default actions
