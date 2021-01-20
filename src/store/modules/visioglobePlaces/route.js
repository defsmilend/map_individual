import Vue from 'vue'
import translation from 'theme/resource/translate_navigation.json'
import { getImageLink } from 'theme/helpers'
import JQuery from 'jquery'
let jQuery = JQuery

function getPoiRoutingNode (rootState, poi) {
  const { x, y } = poi.options('position')
  const floor = poi.options('floor')
  const { getRoutingNode, convertPointToLatLon } = rootState.visioglobe.mapviewer
  const { lat, lon } = convertPointToLatLon({ x, y })
  const position = { lat, lon, floor }
  return getRoutingNode(position)
}

const state = {
  from: null,
  waypoints: [],
  to: null,
  selectedNavPoint: null,
  currentRoute: null,
  computedRoute: null,
  currentAnimatedPath: null,
  destinationOrder: 'optimalFinishOnLast',
  handicap: false,
  navigation: {
    enabled: true,
    translator: null,
    languageCode: 'ru',
    currentNavigation: null,
    currentInstructionIndex: 0
  },
  navPoints: [],
  navPointsCount: 0,
  nearPlace: [],
  routeDestinationId: null,
  viewMode: 'finalFloor',
  timeoutIdOfComputingRouteAvailability: 0,
  routeViewScaleFactor: 0
}

const getters = {
  computed: state => (state.currentRoute !== null),
  nbInstructions: state => {
    if (state.navigation.currentNavigation !== null) {
      return state.navigation.currentNavigation.getNbInstructions()
    }
    return 0
  },
  currentInstructionData: state => {
    if (state.navigation.currentNavigation !== null) {
      return state.navigation.currentNavigation.getInstructionData(state.navigation.currentInstructionIndex)
    }
    return null
  },
  getAllInstructions: (state, getters) => {
    if (state.navigation.currentNavigation) {
      const instructions = []

      for (let i = 0; i < getters.nbInstructions; i++) {
        instructions.push(state.navigation.currentNavigation.getInstructionData(i))
      }
      return instructions
    }
  },
  currentInstructionIcon: (state, getters, rootState) => {
    if (getters.currentInstructionData !== null) {
      return rootState.visioglobe.imagePath + '/' + getters.currentInstructionData.icon
    }
    return ''
  },
  currentInstructionDetail: (state, getters) => {
    if (getters.currentInstructionData !== null) {
      return getters.currentInstructionData.detail
    }
    return ''
  }
}

const mutations = {
  setFrom: (state, id) => {
    state.from = id
  },
  addWaypoint: (state, id) => {
    state.waypoints = [...state.waypoints, id]
  },
  removeWaypoint: (state, index) => {
    state.waypoints = state.waypoints.splice(index, 1)
  },
  setTo: (state, id) => {
    state.to = id
  },
  setCurrentRoute: (state, route) => {
    state.currentRoute = route
  },
  setComputedRoute: (state, route) => {
    state.computedRoute = route
  },
  setNavigationEnabled: (state, value) => {
    Vue.set(state.navigation, 'enabled', value)
  },
  setNavigationTranslator: (state, translator) => {
    Vue.set(state.navigation, 'translator', translator)
  },
  setNavigationLanguageCode: (state, languageCode) => {
    Vue.set(state.navigation, 'languageCode', languageCode)
  },
  setCurrentNavigation: (state, navigation) => {
    Vue.set(state.navigation, 'currentNavigation', navigation)
  },
  setCurrentInstructionIndex: (state, index) => {
    Vue.set(state.navigation, 'currentInstructionIndex', index)
  },
  setDestinationOrder: (state, destinationOrder) => {
    state.destinationOrder = destinationOrder
  },
  setHandicap: (state, handicap) => {
    state.handicap = handicap
  },
  reset: (state) => {
    state.from = null
    state.waypoints = []
    state.to = null
    state.currentRoute = null
    state.computedRoute = null
    state.selectedNavPoint = undefined
    state.destinationOrder = 'optimalFinishOnLast'
    state.handicap = false
    state.navigation.currentNavigation = null
  },
  changeViewMode: (state, viewMode) => {
    state.viewMode = viewMode
  },
  setTimeoutIdOfComputingRouteAvailability: (state, timeoutID) => {
    state.timeoutIdOfComputingRouteAvailability = timeoutID
  },
  changeRouteViewScaleFactor: (state, routeViewScaleFactor) => {
    state.routeViewScaleFactor = routeViewScaleFactor
  },
  setNavPointsCount: (state, count) => {
    state.navPointsCount = count
  },
  addNavPoint: (state, point) => {
    state.navPoints.push(point)
  },
  clearNavPoints: (state) => {
    state.navPoints.forEach((poi) => {
      poi.remove()
    })
    state.navPoints = []
    state.navPointsCount = null
  },
  setCurrentAnimatedPath: (state, path) => {
    state.currentAnimatedPath = path
  },
  clearAnimatedPath: (state) => {
    const path = state.currentAnimatedPath
    if (path) {
      path.remove()
    }
    state.currentAnimatedPath = null
  },
  selectNavPoint: (state, num) => {
    state.selectedNavPoint = num
  },
  setNearPlace: (state, place) => {
    state.nearPlace.push(place)
  },
  clearNearPlace: (state, index) => {
    state.nearPlace.splice(index, 1)
  },
  setRouteDestinationId: (state, id) => {
    state.routeDestinationId = id
  },
  clearRouteDestinationId: (state) => {
    state.routeDestinationId = null
  }
}

const actions = {
  initTranslator: ({ rootState, commit, dispatch }) => {
    rootState.visioglobe.mapviewer.setupNavigationTranslator(rootState.visioglobe.places.byID)
    // add other languages here
    const translationRU = JSON.stringify(translation)
    rootState.visioglobe.mapviewer.navigationTranslator.addOrUpdateLanguage('ru', translationRU)
    commit('setNavigationTranslator', rootState.visioglobe.mapviewer.navigationTranslator)
    dispatch('setNavigationLanguageCode', { languageCode: rootState.visioglobe.parameters.locale.language })
  },
  setNavigationLanguageCode: ({ state, commit, rootState, getters }, { languageCode }) => {
    const code = window.visioweb.Utils.getLanguageMatch(languageCode, state.navigation.translator.getLanguageCodes())
    commit('setNavigationLanguageCode', code)
    // переводим на другой язык имеющиеся инструкции
    if (state.computedRoute) {
      rootState.visioglobe.mapviewer.navigationTranslator.translateInstructions(state.computedRoute.data.navigation, code)
    }
  },
  setFrom: ({ state, commit, dispatch, rootState }) => {
    const id = rootState.terminals.terminal.visioglobe_id
    const index = state.waypoints.indexOf(id)
    if (index !== -1) {
      commit('removeWaypoint', index)
    }
    commit('setFrom', id)
    if (state.to !== null) {
      return dispatch('computeRoute')
    }
    return Promise.resolve()
  },
  addWaypoint: ({ state, commit, dispatch }, { id }) => {
    if (id !== state.from &&
      id !== state.to &&
      state.waypoints.indexOf(id) === -1) {
      commit('addWaypoint', id)
      if (state.from !== null && state.to !== null) {
        return dispatch('computeRoute')
      }
    }
    return Promise.resolve()
  },
  setTo: ({ state, commit, dispatch, rootState }, { id, viewMode = 'floor', isPoi = false, routeViewScaleFactor }) => {
    if (state.timeoutIdOfComputingRouteAvailability) return console.log('Computing route is unvailable now')
    dispatch('turnOffComputingRouteAvailability')
    dispatch('map/showRouteDescription', isPoi, { root: true })
    const index = state.waypoints.indexOf(id)
    dispatch('setFrom')
    if (index !== -1) {
      commit('removeWaypoint', index)
    }
    commit('setTo', id)
    if (state.from !== null) {
      commit('changeViewMode', viewMode)
      commit('changeRouteViewScaleFactor', routeViewScaleFactor || rootState.config.visioglobe.scaling.routeViewScaleFactor)
      return dispatch('computeRoute')
    }
    return Promise.resolve()
  },
  setToPoi: ({ state, commit, dispatch, rootState }, { poi, viewMode, routeViewScaleFactor }) => {
    const { activePoi } = rootState.visioglobe.places
    poi = Array.isArray(poi)
      ? poi.find(poi => poi.vg)
      : poi
    if (!poi) return Promise.reject('POI is undefined.')
    const poiRoutingNode = getPoiRoutingNode(rootState, poi)
    let isSamePositionAsActivePoi = false
    if (activePoi) {
      // получаем координаты точки к которой рисуется маршрут - сравниваем именно route position
      const poiRoutePosition = poiRoutingNode.routePosition
      const activePoiRoutePosition = getPoiRoutingNode(rootState, activePoi).routePosition
      isSamePositionAsActivePoi = poiRoutePosition.x === activePoiRoutePosition.x &&
        poiRoutePosition.y === activePoiRoutePosition.y &&
        poiRoutePosition.z === activePoiRoutePosition.z
    }
    if (!isSamePositionAsActivePoi) {
      dispatch('setTo', { id: poiRoutingNode.position, viewMode, isPoi: true, routeViewScaleFactor })
    }
    dispatch('visioglobe/places/setActivePoi', poi, { root: true })
    return Promise.resolve()
  },
  computeRoute: ({ state, rootState, dispatch }) => {
    if (state.from === '' || state.to === '' || state.from === state.to ||
      state.from === false || state.to === false) {
      return Promise.reject()
    }

    const lRouteRequest = {}
    lRouteRequest.src = state.from
    lRouteRequest.dst = [...state.waypoints, state.to]
    lRouteRequest.destinationOrder = state.destinationOrder
    lRouteRequest.computeNavigation = state.navigation.enabled

    lRouteRequest.routingParameters = {}
    if (state.handicap) {
      lRouteRequest.routingParameters.excludedAttributes = ['escalator', 'stairway']
    }

    return rootState.visioglobe.mapviewer.computeRoute(lRouteRequest)
      .then(dispatch('clearRoute'))
      .then(route => dispatch('initRoute', { route }))
      .catch((e) => console.error(e))
  },
  waitClearNavPoints: ({ commit }, routeNavigation) => {
    // возвращаем промис, что бы точки на карте успели удалиться до момента нового построения
    return new Promise(resolve => {
      commit('clearNavPoints')
      resolve()
    })
  },
  waitNavPointsSet: ({ commit }, routeNavigation) => {
    // указываем количество точек, необходимо для их построения
    // возвращаем промис, что бы точки на карте успели построиться до момента их закрепления
    return new Promise(resolve => {
      commit('setNavPointsCount', routeNavigation.length)
      resolve()
    })
  },
  waitClearNearPlace: ({ commit }, index) => {
    // возвращаем промис, что бы точки на карте успели удалиться до момента нового построения
    return new Promise(resolve => {
      commit('clearNearPlace', index)
      resolve()
    })
  },
  waitNearPlaceSet: ({ commit }, nearPlace) => {
    // возвращаем промис, что бы точки на карте успели построиться до момента их закрепления
    return new Promise(resolve => {
      commit('setNearPlace', nearPlace)
      resolve()
    })
  },
  waitClearDestination: ({ commit }) => {
    return new Promise(resolve => {
      commit('clearRouteDestinationId')
      resolve()
    })
  },
  waitSetDestination: ({ commit }, destination) => {
    return new Promise(resolve => {
      commit('setRouteDestinationId', destination)
      resolve()
    })
  },
  clearAnimatedPath: ({ commit }) => {
    if (window.pathAnimation) {
      window.pathAnimation.stop()
    }
    commit('clearAnimatedPath')
  },
  animateRoute: async ({ commit, rootState, dispatch, state }, { currentRoute, route, options }) => {
    dispatch('clearAnimatedPath')
    await dispatch('waitClearNavPoints')
    await dispatch('waitClearDestination')
    await dispatch('removeNearPlaceFromMap')
    // из маршрута получаем его колени для дальнейшей анимации и расставления точек
    const routeLegs = route.data.legs[0].points
    const routeNavigation = route.data.navigation.instructions

    let pathPoints = []
    routeLegs.forEach(leg => {
      // конвертация коленей маршрута из широты и долготы, в понятную для пути  x, y, z точек
      pathPoints.push(rootState.visioglobe.mapviewer.convertLatLonToPoint(leg))
    })

    await dispatch('waitNavPointsSet', routeNavigation)

    // отрисованные точки закрепляем за позициями на карте
    routeNavigation.forEach((nav, index) => {
      const pos = rootState.visioglobe.mapviewer.convertLatLonToPoint(nav.position)
      const poi = rootState.visioglobe.mapviewer.addPOI({
        selector: '#navPoint' + index,
        // url: '/assets/map/navPoint.png',
        position: pos,
        fixed: true,
        // width: 30,
        // height: 30,
        floor: nav.dataset
      })
      commit('addNavPoint', poi)
      if (index === routeNavigation.length - 1) {
        // заношу в стейт конечную точку маршрута
        dispatch('waitSetDestination', nav.nearPlaces[0].id)
      }
    })

    // объявляем будующий анимированный путь
    const animatedPath = await rootState.visioglobe.mapviewer.addPath({
      points: pathPoints,
      color: rootState.visioglobe.parameters.mapview.colors.pathPast,
      overlay: false
    })
    commit('setCurrentAnimatedPath', animatedPath)
    animatedPath.show()
    const pathAnimation_start = () => {
      window.pathAnimation = jQuery({v: 0}).animate({v: 1},
        {
          duration: rootState.config.visioglobe.pathAnimationDuration,
          easing: 'linear',
          step: function (v) {
            var length = animatedPath.getLength()
            var displayLength = 500 * v
            animatedPath.setInterpolatedStartEnd(v - displayLength / length, v)
            animatedPath.getInterpolatedPosition(v)
          },
          complete: function () {
            animatedPath.getInterpolatedPosition(0)
            animatedPath.remove()
            dispatch('showRoute', { currentRoute, route, options })
          }
        })
    }
    pathAnimation_start()
  },
  initRoute: ({ state, rootState, commit, dispatch }, { route }) => {
    if (route.data.status && route.data.status !== 200) {
      commit('reset')
      return Promise.reject('Sorry, no route available between ' + route.request.src + ' and ' + route.request.dst + '.')
    }

    const options = {
      pathColor: {
        past: rootState.visioglobe.parameters.mapview.colors.pathPast,
        current: rootState.visioglobe.parameters.mapview.colors.pathCurrent,
        future: rootState.visioglobe.parameters.mapview.colors.pathFuture
      },
      pathOpacity: 1,
      arrowWidth: 0,
      arrowSpeed: 0,
      floorChangeTag: {
        innerHTML: function (id, floor, up) {
          return `\
                    <div id="${id}" class="route_floorChange" style="background-image: url(${rootState.visioglobe.imagePath}/track_floor_change_tag.png)">\
                        <div>\
                            <img class="${(up ? 'fcup' : 'fcdown')}" src="${(up ? rootState.visioglobe.imagePath + '/track_up.png' : rootState.visioglobe.imagePath + '/track_down.png')}"/>\
                        </div>\
                        <p>${floor}</p>\
                    </div>`
        },
        parent: 'floorChangeTags'
      }
    }
    const currentRoute = new window.visioweb.Route(rootState.visioglobe.mapviewer, route.data, options)
    currentRoute.hide()
    if (window.pathAnimation) {
      window.pathAnimation.stop()
    }
    dispatch('animateRoute', { currentRoute, route, options })
    dispatch('showRouteNavigation', { currentRoute, route })
  },
  showRouteNavigation: ({ state, rootState, dispatch, commit }, { currentRoute, route }) => {
    if (route.data.navigation !== undefined) {
      commit('setCurrentNavigation', currentRoute.navigation)
      if (!rootState.visioglobe.mapviewer.navigationTranslator) {
        dispatch('initTranslator')
      }
      rootState.visioglobe.mapviewer.navigationTranslator.translateInstructions(route.data.navigation, state.navigation.languageCode)
      // state.navigation.translator.translateInstructions(route.data.navigation, state.navigation.languageCode)
      commit('setCurrentInstructionIndex', 0)
      dispatch('map/showRouteDescription', true, { root: true })
    }
  },
  showRoute: ({ rootState, dispatch, commit }, { currentRoute, route }) => {
    if (currentRoute.isValid()) {
      return currentRoute.show().then(() => {
        commit('setCurrentRoute', currentRoute)
        commit('setComputedRoute', route)
        if (route.data.navigation !== undefined) {
          if (state.viewMode === 'wholeFloor') {
            dispatch('visioglobe/goToDefaultView', null, { root: true })
          } else {
            let { x, y, radius } = currentRoute.getViewpointPosition(state.viewMode)
            radius = 300
            const goToOptions = {
              mode: 'floor',
              floorID: currentRoute[state.viewMode],
              animationDuration: 0.4,
              viewpoint: {
                position: { x, y, radius }
              }
            }
            rootState.visioglobe.multiBuildingView.goTo(goToOptions)
          }
        }
      })
        .catch((e) => console.error(e))
    } else {
      commit('reset')
      return Promise.reject('Problems rendering the route between ' + route.request.src + ' and ' + route.request.dst + '.')
    }
  },
  clearRoute: ({ state, commit, dispatch }) => {
    // remove current Route
    if (state.currentRoute && typeof state.currentRoute.remove === 'function') {
      try {
        state.currentRoute.remove()
      } catch (e) {
        console.warn(e)
      }
    }
    commit('reset')
    dispatch('visioglobe/places/setActivePoi', null, { root: true })
  },
  getNearestPoint ({ rootState, rootGetters }, { mapPoints }) {
    const { computeDistance } = rootState.visioglobe.mapviewer
    const terminalPosition = rootGetters['terminals/getTerminalPosition']
    const terminalFloor = rootState.terminals.terminalPOI.options('floor')

    if (!Array.isArray(mapPoints)) {
      return Promise.reject('Wrong parameters: mapPoints isn\'t Array')
    }
    const points = mapPoints.map(mapPoint => {
      if (!mapPoint) return
      if (Array.isArray(mapPoint)) {
        mapPoint = mapPoint.find(POI => POI)
      }
      let position = null
      let floor = null
      if (mapPoint.vg && mapPoint.vg.poi) {
        position = mapPoint.options('position')
        floor = mapPoint.options('floor')
      } else {
        position = mapPoint.vg.position
        floor = mapPoint.vg.floor
      }
      return { mapPoint, floor, position }
    })

    const pointsWithSameFloorAsTerminal = points.filter(point => point.floor === terminalFloor)
    const getMapPointsWithDistance = ({ mapPoint, position }) => {
      const distance = computeDistance(terminalPosition, position)
      return { mapPoint, distance }
    }
    const pointsWithDistance = pointsWithSameFloorAsTerminal.length
      ? pointsWithSameFloorAsTerminal.map(getMapPointsWithDistance)
      : points.map(getMapPointsWithDistance)

    const nearestPoint = pointsWithDistance.sort((a, b) => a.distance - b.distance)[0]
    return nearestPoint
      ? nearestPoint.mapPoint
      : null
  },
  computeDistanceFromTerminal ({ rootState, rootGetters }, endPoint) {
    const { computeDistance } = rootState.visioglobe.mapviewer
    const terminalPosition = rootGetters['terminals/getTerminalPosition']
    return computeDistance(terminalPosition, endPoint)
  },
  turnOffComputingRouteAvailability ({ commit }) {
    const timeoutID = setTimeout(() => {
      commit('setTimeoutIdOfComputingRouteAvailability', 0)
    }, 100)
    commit('setTimeoutIdOfComputingRouteAvailability', timeoutID)
  },
  selectNavPoint ({ commit, state, rootState }, num) {
    const offsetPoint = num + 1
    commit('selectNavPoint', offsetPoint)
    let point = state.navPoints[offsetPoint]
    // если последняя точка в маршруте
    if (offsetPoint === state.navPoints.length) {
      point = rootState.visioglobe.mapviewer.getPOI(state.routeDestinationId)[0]
    }
    if (point && point.vg.poi) {
      // зум на точке, при её выборе на карте
      const options = point.options()
      const goToOptions = {
        mode: 'floor',
        floorID: options.floor,
        animationDuration: 0.4,
        viewpoint: {
          position: {
            x: options.position.x,
            y: options.position.y,
            radius: 150
          }
        }
      }
      rootState.visioglobe.multiBuildingView.goTo(goToOptions)
    }
  },
  removeNearPlaceFromMap: async ({ state, dispatch }) => {
    if (state.nearPlace && state.nearPlace.length) {
      state.nearPlace.forEach(async (place, index) => {
        place.remove()
        await dispatch('waitClearNearPlace', index)
      })
    }
  },
  showNearPlace: async ({ rootState, state, dispatch }, { nearPlace, onlyClearPlace = false }) => {
    await dispatch('removeNearPlaceFromMap')
    if (!onlyClearPlace) {
      let poiLogo, poiPos, poiFloor
      // получаем отрисованную POI и её лого (т.к. лого приходящее с карты и с админки могут отличаться!)
      const existPOI = rootState.visioglobe.mapviewer.getPOI(nearPlace)
      if (existPOI && existPOI.length) {
        const poiOptions = existPOI[0].options()
        poiLogo = poiOptions.url
        poiPos = poiOptions.position
        poiFloor = poiOptions.floor
      }
      if (!poiLogo) {
        const mallObjectFromVGId = await dispatch('mallObjects/loadByVisioglobe', nearPlace, { root: true })
        if (mallObjectFromVGId && mallObjectFromVGId.length && mallObjectFromVGId[0].company) {
          poiLogo = getImageLink(mallObjectFromVGId[0].company.images[0].id)
        }
      }
      // из полученных данных создаю точку на карте
      const nearPoi = await rootState.visioglobe.mapviewer.addPOI({
        url: poiLogo,
        position: poiPos,
        floor: poiFloor,
        width: 15,
        height: 15,
        overlay: true,
        fixed: false,
        flip: true,
        face2d: false
      })
      dispatch('waitNearPlaceSet', nearPoi)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
