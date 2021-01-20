import Vue from 'vue'
import _ from 'lodash'

const state = {
  byID: {},
  activePlace: null,
  activePlaces: [],
  activePoi: null,
  activePois: [],
  highlightedPlace: null,
  bubblePopups: [],
  selectedSearchPOI: null,
  svgPois: [],
  activeTabSidebar: '',
  anchorTenant: [],
  discountAnchorTenants: [],
  maPoints: [],
  placeIds: [],
  pois: null
}

const getters = {
  byName (state) {
    return _.transform(state.byID, (result, { name, floor, description }, id) => {
      result[name] = { id, floor, description }
    }, {})
  },
  activePlaceID: state => {
    if (state.activePlace !== null) {
      return state.activePlace.vg.id
    }
    return ''
  },
  activePlaceContent: (state, getters) => {
    if (state.activePlace !== null && typeof (state.byID[getters.activePlaceID]) !== 'undefined') {
      return state.byID[getters.activePlaceID]
    }
    return {
      name: '',
      description: ''
    }
  },
  activePlaceName: (state, getters) => {
    return getters.activePlaceContent.name
  },
  activePlaceDescription: (state, getters) => {
    return getters.activePlaceContent.description
  },
  activePlaceLogo: (state, getters) => {
    return getters.activePlaceContent.logo
  },
  activeMapPointsByFloors: (state, getters, rootState, rootGetters) => {
    const activeMapPoints = {}
    const floors = Object.keys(rootGetters['visioglobe/venue/floorNames'])
    for (let floor of floors) {
      const placesOnTheFloor = state.activePlaces.filter(place => place.vg && place.vg.floor === floor)
      const poisOnTheFloor = state.activePois.filter(poi => poi.options('floor') === floor)
      activeMapPoints[floor] = [...placesOnTheFloor, ...poisOnTheFloor]
    }
    return activeMapPoints
  }
}

const mutations = {
  setPlacesByID: (state, byID) => {
    state.byID = byID
  },
  addPlace: (state, { id, name, floor }) => {
    Vue.set(state.byID, id, { name, floor })
  },
  setPlaceName: (state, { id, name }) => {
    Vue.set(state.byID, id, { ...state.byID[id], name })
  },
  setPlaceDescription: (state, { id, description }) => {
    Vue.set(state.byID, id, { ...state.byID[id], description })
  },
  setActivePlace: (state, place) => {
    state.activePlace = place
    state.highlightedPlace = state.highlightedPlace !== place ? state.highlightedPlace : null
  },
  setActivePoi: (state, poi) => {
    state.activePoi = poi
  },
  addActivePoi: (state, poi) => {
    state.activePois.push(poi)
  },
  setHighlightedPlace: (state, place) => {
    state.highlightedPlace = place
  },
  addBubblePopup: (state, bubblePopup) => {
    state.bubblePopups.push(bubblePopup)
  },
  resetActivePois: (state) => {
    state.activePois = []
  },
  resetActivePlaces: (state) => {
    state.activePlaces = []
  },
  addActivePlace: (state, place) => {
    state.activePlaces.push(place)
  },
  removeBubblePopup: (state, indexBubblePopup) => {
    state.bubblePopups.splice(indexBubblePopup, 1)
  },
  setSelectedSearchPOI: (state, place) => {
    state.selectedSearchPOI = place
  },
  addSvgPoi: (state, poi) => {
    state.svgPois.push(poi)
  },
  removeSvgPoi: (state, index) => {
    state.svgPois.splice(index, 1)
  },
  setTabSidebar: (state, value) => {
    state.activeTabSidebar = value
  },
  setAnchorTenant: (state, value) => {
    state.anchorTenant = value
  },
  setDiscountAnchorTenants: (state, value) => {
    state.discountAnchorTenants.push(value)
  },
  cleanDiscountAnchorTenants: (state) => {
    state.discountAnchorTenants = []
  },
  setPlaceIds: (state, placeIds) => {
    state.placeIds = placeIds
  },
  setMapPoints: (state, mapPoints) => {
    state.mapPoints = mapPoints
  },
  setPOIs: (state, pois) => {
    state.pois = pois
  }
}

const actions = {
  initPlaces: async ({ rootState, commit, dispatch, state }) => {
    let mapLoaded, mapInited
    rootState.visioglobe.mapviewer.on('initializeCompleted', ev => {
      mapInited = true
    })
    rootState.visioglobe.mapviewer.on('loadCompleted', ev => {
      mapLoaded = true
    })
    if (!mapLoaded || !mapInited) return Promise.reject('Map\'s not ready yet!')
    const extraData = rootState.visioglobe.mapviewer.getExtraData();
    if (
      !extraData ||
      !extraData.resources ||
      !extraData.resources.default
    ) return Promise.reject('Map\'s extra data is undefined!')

    const { places } = extraData.resources.default.localized.locale.default
    if (!places) return Promise.reject('Places is undefined!')

    const byID = {}
    const placeIds = Object.keys(places)
    const { getPlace, setPlaceName, getPOI } = rootState.visioglobe.mapviewer
    const mapPoints = await dispatch('mallObjects/loadByVisioglobe', placeIds, { root: true })
    commit('setPlaceIds', placeIds)
    commit('setMapPoints', mapPoints)
    const typeIdforAnchor = rootState.config.types.anchorTenant

    await dispatch('mallObjects/loadMallObjects', { typeIds: typeIdforAnchor }, { root: true }).then(anchorTenant => {
      commit('setAnchorTenant', anchorTenant)
    })
    placeIds.forEach(placeID => {
      const mallFound = mapPoints.find(mall => mall && mall.visioglobe_id === placeID)

      if (!mallFound) return

      const mapPlace = getPlace(placeID)
      let mapPOI = getPOI(placeID)
      if (mapPlace !== false || mapPOI !== undefined) {
        let logo = null
        const floor = mapPlace
          ? mapPlace.vg.floor
          : mapPOI.find(poi => poi.vg).options('floor')
        if (mallFound.company && Array.isArray(mallFound.company.images)) {
          logo = mallFound.company.images.find(el => el.id) || null
        }
        byID[placeID] = {
          name: mallFound.name,
          floor,
          description: mallFound.description,
          logo: logo && logo.id,
          companyID: mallFound.id,
          code: mallFound.type && mallFound.type.code,
          color: mallFound.color_code,
          typeId: mallFound.type_id,
          categories: mallFound.categories,
          offers: mallFound.offers
        }
        const options = {
          id: placeID,
          text: mallFound.name,
          // url: place.icon, // not included in web bundle yet
          textTextureHeight: 128,
          // textTextureHeight: 64, // for limited platforms or big maps
          zoomScaleFactor: 0,
          multiline: false,
          vgnobatch: false
        }
        setPlaceName(placeID, options)
      }
    })
    const getPois = rootState.visioglobe.mapviewer.getPOIs()
    const allPois = Object.entries(getPois)
    commit('setPOIs', allPois)
    commit('setPlacesByID', byID)
    let timer = 0
    dispatch('initPois', { placeIds, mapPoints }).then(() => {
      timer = setTimeout(() => {
        dispatch('redrawStandardIcons')
        clearTimeout(timer)
      }, 30000)
    })
  },
  initPois: async ({ state, rootState, dispatch }, { placeIds, mapPoints }) => {
    if (!mapPoints || !placeIds) return
    const allPois = state.pois
    placeIds.forEach(poiId => {
      const mallObjFound = mapPoints.find(mallObj => mallObj && mallObj.visioglobe_id === poiId)
      const matchedPOIentries = allPois.find(entries => entries[0] === poiId)

      if (!matchedPOIentries || !mallObjFound) return

      const mapPois = matchedPOIentries[1]
      mapPois.forEach(async poi => {
        let mallObj = mapPoints.find(mallObj => mallObj.visioglobe_id === poi.options().id)
        if (!mallObj) return

        let isBrands = mallObj && mallObj.categories && mallObj.categories.length && mallObj.categories.some(category => category.map_use_grouped_brands)
        let imageId = ''
        if (isBrands && mallObj.company && mallObj.company.id) {
          const companyIDs = []
          companyIDs.push(mallObj.company.id)
          const companyRequest = await dispatch('companies/load', { ids: companyIDs }, { root: true })
          if (!companyRequest || !companyRequest.items || !companyRequest.items.length) return
          const company = companyRequest.items[0]
          if (company.images && company.images.length) {
            const imageArr = mallObj.company.images
            const imageObj = imageArr.find(image => image.id)
            imageId = imageObj ? imageObj.id : ''
          }
        }
        dispatch('modifyPoi', { poi, poiColor: mallObj.color_code, imageId, title: mallObj.name })
      })
    })
  },
  setPlaceName: ({ state, rootState, commit }, { id, name }) => {
    if (state.byID[id] !== undefined) {
      commit('setPlaceName', { id, name })
      rootState.visioglobe.mapviewer.setPlaceName(id, name)
    } else {
      const placeObject = rootState.visioglobe.mapviewer.getPlace(id)
      const poiObject = rootState.visioglobe.mapviewer.getPOI(id) // /!\ if not found returns undefined, not false
      if (placeObject !== false || poiObject !== undefined) {
        const floor = placeObject ? rootState.visioglobe.mapviewer.getPlace(id).vg.floor : poiObject[0].options('floor')
        commit('addPlace', { id, name, floor })
        const options = {
          id,
          text: name,
          textTextureHeight: 32,
          zoomScaleFactor: 1.5,
          multiline: true
        }
        rootState.visioglobe.mapviewer.setPlaceName(id, options)
      } else {
        return Promise.reject('place not found.')
      }
    }
  },
  setPlaceDescription: ({ state, commit }, { id, description }) => {
    if (state.byID[id] !== undefined) {
      commit('setPlaceDescription', { id, description })
    } else {
      return Promise.reject('place not initialized. First set the place name, then its description.')
    }
  },
  setActivePlace: async ({ state, rootState, commit, dispatch }, { placeId, viewMode }) => {
    try {
      const { getPlace, getPOI } = rootState.visioglobe.mapviewer
      const mapPoint = getPlace(placeId) || getPOI(placeId)
      commit('cleanDiscountAnchorTenants')
      if (Array.isArray(mapPoint)) {
        await dispatch('visioglobe/setInitialStateOfMap', null, { root: true })
        dispatch('visioglobe/route/setToPoi', { poi: mapPoint }, { root: true })
        dispatch('setActiveTabSidebarMap', '')
        if (mapPoint.length > 1) { // если mapPoint имеет группу poi
          dispatch('map/setActiveMapPoint', { mapPoint, poiGroup: true }, { root: true })
        }
        return
      }

      if (!mapPoint) return Promise.reject('Can\'t find the map point')
      if (mapPoint === state.activePlace) return

      if (!state.activePlaces.some(place => place.vg.id === placeId)) { // если текущий plece не является из группы
        await dispatch('visioglobe/setInitialStateOfMap', null, { root: true })
        dispatch('setActiveTabSidebarMap', '')
        dispatch('paintPlace', { place: mapPoint })
      }
      commit('setActivePlace', mapPoint)
      const timerId = setTimeout(() => {
        dispatch('createBubblePopup', {
          placeId,
          selector: '#bubble',
          alignment: { x: -0.08, y: 1.7 }
        })
        clearInterval(timerId)
      }, rootState.config.visioglobe.pathAnimationDuration)
      dispatch('visioglobe/route/setTo', { id: placeId, viewMode }, { root: true })
    } catch (err) { throw Error(err) }
  },
  /**
   * @param state
   * @param rootState
   * @param commit
   * @param dispatch
   * @param arrayPlaces
   */
  showPlaces: ({ state, rootState, commit, dispatch }, { arrayPlaces }) => {
    state.activePlaces.forEach(place => {
      rootState.visioglobe.mapviewer.resetPlaceColor(place)
    })
    state.pois.forEach(poi => {
      poi.remove()
    })
    let pois = arrayPlaces.map(place => {
      rootState.visioglobe.mapviewer.setPlaceColor(place, rootState.visioglobe.parameters.mapview.colors.active)
      return rootState.visioglobe.mapviewer.addPOI({
        selector: '#bubble' + (place.vg.id ? place.vg.id : place.options().id),
        floor: place.vg.floor ? place.vg.floor : place.options().floor,
        position: place.vg.position ? place.vg.position : place.options().position,
        alignment: { x: -0.15, y: 1 },
        overlay: true,
        visible: true
      })
    })
    commit('setActivePlaces', arrayPlaces)
    commit('setActivePois', pois)
  },
  resetActivePlace: ({ state, rootState, commit, dispatch }) => {
    if (state.activePlace !== null && !state.activePlace.vg.poi) {
      rootState.visioglobe.mapviewer.resetPlaceColor(state.activePlace)
      dispatch('resetActivePlaces')
      dispatch('removeBubblePopup', state.activePlace.vg.id)
      commit('setActivePlace', null)
    }
  },
  setHighlightedPlace: ({ state, rootState, commit, dispatch }, { place }) => {
    // If the place is actually a POI, find the place with the same id.
    if (place.vg && place.vg.poi) {
      place = place.options && rootState.visioglobe.mapviewer.getPlace(place.options('id'))
      if (place === false) {
        return
      }
    }
    if (place === false || place instanceof Array ||
      place === state.highlightedPlace || place === state.activePlace) {
      return
    }
    dispatch('resetHighlightedPlace').then(() => {
      if (typeof (place) !== 'undefined' && place !== state.activePlace) {
        rootState.visioglobe.mapviewer.setPlaceColor(place, 0xFFFFFF - place.vg.originalColor)
      }
      commit('setHighlightedPlace', place)
    })
  },
  resetHighlightedPlace: ({ state, rootState, commit }) => {
    if (state.highlightedPlace !== null) {
      rootState.visioglobe.mapviewer.resetPlaceColor(state.highlightedPlace)
      commit('setHighlightedPlace', null)
    }
  },
  async setColorsForAnchors ({ rootState, dispatch, state, commit }, { activeAnchor, isInitialColor, groupAnchor }) {
    if (!groupAnchor) commit('cleanDiscountAnchorTenants')
    const anchorTenants = state.anchorTenant
    const placesAnchorTenant = await dispatch('getPlaces', anchorTenants)
    let anchorColors = rootState.config.placeColors.anchorColors
    const { setPlaceColor, resetPlaceColor } = rootState.visioglobe.mapviewer
    if (placesAnchorTenant && placesAnchorTenant.length) {
      placesAnchorTenant.forEach(place => {
        const originalColor = place.vg && place.vg.originalColor
        if (!place.vg) return
        const placeId = place.vg.id
        let anchorColor = anchorColors[originalColor]

        if (groupAnchor && placeId !== activeAnchor) return
        // раскрашиваем неактивные арендаторы или при уходе со страницы оригинальным цветом
        const anchorsOnMap = state.discountAnchorTenants.includes(placeId)
        if ((!anchorsOnMap && anchorColor && placeId !== activeAnchor) || isInitialColor) {
          if (isInitialColor) {
            resetPlaceColor(place)
          } else {
            setPlaceColor(place, anchorColor)
          }
          return
        }
        // Сет цвета у активного якорного арендатора
        if (placeId === activeAnchor) {
          if (groupAnchor) commit('setDiscountAnchorTenants', placeId)
          if (anchorColor) {
            resetPlaceColor(place)
          } else {
            const { color_code } = anchorTenants.find(mall => mall.visioglobe_id === activeAnchor)
            setPlaceColor(place, color_code)
          }
        }
      })
    }
  },
  paintPlace ({rootState, dispatch, state, commit}, { place, groupAnchor = false, colorCode }) {
    if (!place) return

    const placeID = place.vg.id
    const { placeColors } = rootState.config
    const placeContent = state.byID[placeID]
    if (placeContent) {
      const typeIdforAnchor = rootState.config.types.anchorTenant
      const typeIdCurrentPlaceToString = placeContent.typeId.toString()
      const isAnchorTenant = typeIdforAnchor.includes(typeIdCurrentPlaceToString)
      if (isAnchorTenant) {
        dispatch('setColorsForAnchors', { activeAnchor: placeID, groupAnchor })
      } else {
        const placeColor = colorCode || placeContent.color || placeColors.default.active
        rootState.visioglobe.mapviewer.setPlaceColor(place, placeColor)
        dispatch('setColorsForAnchors', { activeAnchor: null })
      }
    }
    commit('addActivePlace', place)
  },
  resetActivePlaces ({rootState, state, commit}) {
    if (state.activePlaces.length) {
      state.activePlaces.forEach(place => {
        rootState.visioglobe.mapviewer.resetPlaceColor(place)
      })
      commit('resetActivePlaces')
    }
  },
  modifyPoi ({ state, dispatch, commit, rootState }, { poi, poiColor, imageId, title }) {
    if (poi && poi.options('url')) {
      let url = poi.options('url')
      // присваиваем название из url для отрисовки нужного svg
      poi.name = url.substr(url.lastIndexOf('/') + 1).replace(/.png|-/g, '')
      const position = poi.options().position
      let key = Math.floor(position.x + position.y)
      key += poi.options().floor || ''
      poi.id = poi.name ? `${poi.name}-${key}` : ''
      poi.color = poiColor || rootState.config.visioglobe.poiColor
      poi.imageId = imageId || ''
      poi.title = title || ''
    }
  },
  async addActiveMapPoi ({ commit, rootState, dispatch }, { poi, color }) {
    if (color) {
      poi.color = color
    }
    if (!poi.name && poi.proxy.options()) {
      const poiID = poi.proxy.options().id
      if (!poi.title && !poi.imageId) {
        let mallObj = await dispatch('mallObjects/loadByVisioglobe', poiID, { root: true })
        mallObj = mallObj[0]
        let isBrands = mallObj && mallObj.categories && mallObj.categories.length && mallObj.categories.some(category => category.map_use_grouped_brands)
        let imageId = ''
        if (isBrands && mallObj.company && mallObj.company.id) {
          const companyIDs = []
          companyIDs.push(mallObj.company.id)
          const companyRequest = await dispatch('companies/load', { ids: companyIDs }, { root: true })
          if (!companyRequest || !companyRequest.items || !companyRequest.items.length) return
          const company = companyRequest.items[0]
          if (company.images && company.images.length) {
            const imageArr = mallObj.company.images
            const imageObj = imageArr.find(image => image.id)
            imageId = imageObj ? imageObj.id : ''
          }
        }
        dispatch('modifyPoi', { poi, poiColor: mallObj.color_code, imageId, title: mallObj.name })
      }
    }
    poi.proxy.options({
      scale: rootState.config.visioglobe.scaling.minPoiScale
    })
    commit('addActivePoi', poi)
  },
  createSvgPoi ({ rootState, commit }, poi) {
    if (poi.name) {
      const { addPOI } = rootState.visioglobe.mapviewer
      const poiCopy = addPOI({
        selector: `#${poi.id}`,
        id: `${poi.id}-svg`,
        floor: poi.options('floor'),
        position: poi.options('position')
      })
      poiCopy.name = poi.name
      poiCopy.id = poi.id
      commit('addSvgPoi', poiCopy)
    }
  },
  removeSvgPoi ({ state, commit, rootState }, poi) {
    let index = null
    const foundPoi = state.svgPois.find((svgPoi, i) => {
      if (svgPoi.id === poi.id) {
        index = i
        return svgPoi
      }
    })
    if (foundPoi) {
      foundPoi.remove()
      commit('removeSvgPoi', index)
    }
  },
  paintPoiIcon (context, { poi, poiColor }) {
    let iconURL = poi.proxy.options('url')
      .then(res => {
        if (res.status !== 500) {
          poi.proxy.options({ url: iconURL })
        }
      })
  },
  resetActivePois ({ state, commit, rootState }) {
    if (state.activePois.length) {
      const { defaultPoiScale } = rootState.config.visioglobe.scaling
      state.activePois.forEach(poi => {
        let defaultIcon = poi.proxy.options('url')
        poi.proxy.options({
          url: defaultIcon,
          scale: defaultPoiScale
        })
      })
    }
    commit('resetActivePois')
  },
  async scaleNearestPoi ({ rootState, state, dispatch }) {
    const { nearestPoiScale } = rootState.config.visioglobe.scaling
    const nearestPoi = await dispatch('visioglobe/route/getNearestPoint',
      { mapPoints: state.activePois },
      { root: true }
    )
    if (nearestPoi && nearestPoi.vg && nearestPoi.vg.poi) {
      dispatch('transformPopup', { id: nearestPoi.id })
    }
  },
  createBubblePopup ({ commit, rootState }, { placeId, selector, alignment = { x: -0.08, y: 1.7 } }) {
    if (!placeId) return
    const { addPOI, getPlace } = rootState.visioglobe.mapviewer
    const place = getPlace(placeId)

    if (!rootState.visioglobe.places.byID[placeId]) return
    if (!place) return

    try {
      const poi = addPOI({
        selector,
        floor: place.vg.floor,
        position: place.vg.position,
        alignment
      })
      commit('addBubblePopup', { placeId, poi })
      return { placeId, poi }
    } catch (e) {
      console.error(e)
      return false
    }
  },
  removeBubblePopup ({ commit, state }, placeId) {
    let indexBubblePopup = null
    const bubbledPlace = state.bubblePopups.find((el, i) => {
      if (el.placeId === placeId) {
        indexBubblePopup = i
        return el
      }
    })
    if (!bubbledPlace) return
    bubbledPlace.poi.remove()
    commit('removeBubblePopup', indexBubblePopup)
  },
  setSelectedSearchPOI ({commit, dispatch}, placeId) {
    commit('setSelectedSearchPOI', {placeId: placeId})
    dispatch('map/showRouteDescription', true, { root: true })
  },
  getPlaces ({ rootState }, mapPoints) {
    let places = []
    if (mapPoints && mapPoints.length) {
      mapPoints.forEach(point => {
        const foundPlace = rootState.visioglobe.mapviewer.getPlace(point.visioglobe_id)
        places.push(foundPlace)
      })
    }
    return places
  },
  setActiveTabSidebarMap ({ commit }, value) {
    commit('setTabSidebar', value)
  },
  transformPopup ({ commit, rootState }, { id }) {
    let currentPopup = document.getElementById(id)
    if (currentPopup) {
      currentPopup.style.width = rootState.config.visioglobe.scaling.nearestPoiWidth
      currentPopup.style.zIndex = 1
    }
  },
  flipIconName ({ state }, poi) {
    const iconUrl = poi.options().url
    if (/-nonselected/g.test(iconUrl)) {
      poi.options({
        flip: true
      })
    }
  },
  redrawEnters ({ state }, poi) {
    const iconUrl = poi.options().url
    if (/enter-(.{1})/g.test(iconUrl)) {
      const enter = iconUrl.match('enter-(.{1})')
      if (enter && enter.length) {
        poi.options({
          url: '/assets/map/north.png',
          flip: true,
          width: 50,
          height: 50,
          color: '#333333',
          text: `Вход - ${enter[1]}`
        })
      }
    }
  },
  redrawStandardIcons ({ rootState, dispatch }) {
    const allPOIs = Object.values(rootState.visioglobe.mapviewer.getPOIs())
    allPOIs.forEach(poi => {
      if (poi && poi.length) {
        poi.forEach(poi => {
          dispatch('flipIconName', poi)
          // dispatch('redrawEnters', poi)
        })
      }
    })
  },
  setActivePoi ({ commit, dispatch }, poi) {
    if (poi) {
      dispatch('setColorsForAnchors', { activeAnchor: null })
      if (!poi.name) {
        dispatch('modifyPoi', { poi })
      }
    }
    commit('setActivePoi', poi)
  },
  resetActivePoi ({ commit }) {
    commit('setActivePoi', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
