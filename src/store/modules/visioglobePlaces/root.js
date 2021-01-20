import _ from 'lodash'

export const state = {
  mapviewer: null,
  multiBuildingView: null,
  element: null,
  imagePath: '/assets/map',
  isClickActive: true,
  activeGroupPlaceId: [],
  parameters: {
    baseURL: '/map-resource/', // https://mapserver.visioglobe.com/
    hash: 'resource',
    // hash: 'dev-k5e7c98c655d431ae320f038d0bec0892b694e32d', // prod
    // hash: 'kd9426d8cb3f1c532f22b5bcbd325c280bd351feb', // demo
    ui: {
      colors: {
        theme: 'white',
        primary: '#4583AD'
      },
      exploration: {
        type: 'buttons',
        position: 'top',
        floating: false,
        compact: false
      },
      placeinfo: {
        type: 'bubble',
        description: true,
        navigation: true,
        maxheight: 200,
        maxwidth: 300
      },
      modules: {
        search: false,
        zoom: true
      }
    },
    locale: {
      language: 'ru',
      misc: {
        search: 'Search...'
      },
      navigation: {
        start: 'start',
        waypoint: 'waypoint',
        destination: 'destination',
        previous: 'previous',
        next: 'next',
        clear: 'clear route'
      }
    },
    mapview: {
      colors: {
        pathPast: '#D15E61',
        pathCurrent: '#D15E61',
        pathFuture: '#D15E61',
        active: '#4583AD',
        pathOpacity: 0
      },
      config: {
        cameratype: 'perspective',
        viewtype: 'multibuilding',
        animationtype: 'translation'
      }
    }
  },
  cameraPosition: {},
  viewpointPosition: {}
}

export const getters = {}

const stripObject = (input, reference) => {
  if (typeof input !== 'object' || typeof reference !== 'object') {
    return false
  }
  _.each(input, (value, key) => {
    const inputtype = typeof value
    const reftype = typeof reference[key]
    if (reference[key] === undefined) {
      delete input[key]
    } else if (inputtype === 'object') {
      if (reftype === 'object') {
        if (stripObject(value, reference[key])) {
          delete input[key]
        }
      } else {
        delete input[key]
      }
    } else if (reftype === 'object') {
      delete input[key]
    }
  })
  return _.isEmpty(input)
}

export const mutations = {
  createMapviewer: state => {
    state.mapviewer = new window.visioweb.Mapviewer()
    window.mapviewer = state.mapviewer
  },
  initMultiBuildingView: state => {
    if (state.mapviewer !== null) {
      state.mapviewer.setupMultiBuildingView({
        container: state.element,
        viewType: state.parameters.mapview.config.viewtype,
        animationType: state.parameters.mapview.config.animationtype,
        imagePath: state.imagePath
      })
      if (state.mapviewer.multiBuildingView !== false) {
        state.multiBuildingView = state.mapviewer.multiBuildingView
      }
    }
  },
  setElement: (state, element) => {
    state.element = element
  },
  setImagePath: (state, imagePath) => {
    state.imagePath = imagePath
  },
  setParameters: (state, parameters) => {
    stripObject(parameters, state.parameters)
    state.parameters = _.merge(state.parameters, parameters)
  },
  setHashKeyMap: (state, hashKey) => {
    state.parameters.hash = hashKey
  },
  setClickCondition: (state, boolean) => {
    state.isClickActive = boolean
  },
  setActiveGroupPlaceId: (state, placeIds) => {
    state.activeGroupPlaceId = placeIds
  },
  setCameraPosition: (state, position) => {
    state.cameraPosition = position
  },
  setViewpointPosition: (state, position) => {
    state.viewpointPosition = position
  }
}

export const actions = {
  setCameraAndViewpointPosition ({ commit, rootState }) {
    const { defaultViewpointPosition, camera: defaultCameraPosition } = rootState.config.visioglobe
    const { map_camera_settings } = rootState.terminals.terminal
    let cameraPosition = defaultCameraPosition
    let viewpointPosition = defaultViewpointPosition

    if (map_camera_settings) {
      const { camera_position_rotation, camera_position_x, camera_position_y, camera_position_zoom } = map_camera_settings
      cameraPosition.rotation = camera_position_rotation || defaultCameraPosition.rotation
      viewpointPosition.x = camera_position_x || defaultViewpointPosition.x
      viewpointPosition.y = camera_position_y || defaultViewpointPosition.y
      viewpointPosition.radius = camera_position_zoom || defaultViewpointPosition.radius
    }

    commit('setCameraPosition', cameraPosition)
    commit('setViewpointPosition', viewpointPosition)
  },
  changeHashKeyMap ({ commit }, hashKey) {
    commit('setHashKeyMap', hashKey)
  },
  createMapviewer: ({ commit }, { element }) => {
    commit('createMapviewer')
    commit('setElement', element)
  },
  initMapviewer: ({ state, commit, dispatch, rootState }) => {
    dispatch('setCameraAndViewpointPosition')
    if (state.element !== null) {
      return state.mapviewer.initialize(state.element, {
        path: state.parameters.baseURL + rootState.main.mall.visioglobe_hash + '/descriptor.json',
        cameraType: state.parameters.mapview.config.cameratype,
        onObjectMouseUp: (event, targetElement) => dispatch('onObjectMouseUp', { event, targetElement }),
        optimizations: {
          load1: true
        }
      }).then(async () => {
        state.mapviewer.start()
        const width = parseInt(getComputedStyle(state.element).width, 10)
        const height = parseInt(getComputedStyle(state.element).height, 10)
        state.mapviewer.resize(width, height)
        commit('initMultiBuildingView')
        if (state.parameters.mapview.config.viewtype === 'multifloor') {
          state.multiBuildingView.buildingModeEnabled = true
        }

        state.multiBuildingView.floorModePitch = -52.37211542489161
        Object.assign(state.mapviewer.camera, state.cameraPosition)
        // let verticalPitch = -10.0
        // state.multiBuildingView.globalModePitch = 0
        // state.multiBuildingView.buildingModePitch = -70
        // state.multiBuildingView.floorModePitch = 20

        dispatch('venue/initVenue')
        await dispatch('places/initPlaces').then(() => dispatch('route/initTranslator'))
        state.mapviewer.cameraDrivenExplorer.setEnabled(false)
        state.mapviewer.on('MultiBuildingView.exploreStateWillChange', ev => {
          const targetExploreState = ev.args.target
          requestAnimationFrame(() => {
            if (targetExploreState.mode !== undefined && targetExploreState.mode !== state.venue.currentExploreMode) {
              commit('venue/setCurrentExploreMode', targetExploreState.mode)
              dispatch('places/resetActivePlace')
            }
            if (targetExploreState.buildingID !== undefined && targetExploreState.buildingID !== state.venue.currentBuildingID) {
              commit('venue/setCurrentBuildingID', targetExploreState.buildingID)
              dispatch('places/resetActivePlace')
            }
            if (targetExploreState.floorID !== undefined && targetExploreState.floorID !== state.venue.currentFloorID) {
              commit('venue/setCurrentFloorID', targetExploreState.floorID)
            }
          })
        })

        return dispatch('terminals/setTerminalPOI', null, { root: true })
          .then(() => dispatch('goToDefaultView'))
      })
    }
    return Promise.reject('Container element is not initialized.')
  },
  onObjectMouseUp: ({ state, dispatch, rootState }, { targetElement }) => {
    const placeId = targetElement.vg.poi
      ? targetElement.options('id')
      : targetElement.vg.id
    const isTargetElementInGroup = state.activeGroupPlaceId && state.activeGroupPlaceId.includes(placeId)
    if (state.isClickActive || isTargetElementInGroup) {
      return dispatch('places/setActivePlace', { placeId })
        .catch(e => {
          dispatch('goToDefaultView')
        })
    }
  },
  onResize: ({ state }) => {
    const width = parseInt(getComputedStyle(state.element).width, 10) - state.element.offsetLeft
    const height = parseInt(getComputedStyle(state.element).height, 10) - state.element.offsetTop
    state.mapviewer.resize(width, height)
  },
  nextFrame: () => {
    return new Promise(resolve => requestAnimationFrame(resolve))
  },
  setInitialStateOfMap: ({ state, dispatch, rootState }) => {
    dispatch('places/resetActivePlace')
    dispatch('places/resetActivePois')
    dispatch('places/resetActivePlaces')
    dispatch('route/waitClearNavPoints')
    dispatch('route/waitClearDestination')
    dispatch('route/removeNearPlaceFromMap')
    dispatch('route/clearAnimatedPath')
    dispatch('route/clearRoute')
    // TODO: Move to mutation
    Object.assign(state.mapviewer.camera, state.cameraPosition)
  },
  setClickCondition: ({ commit }, boolean) => {
    commit('setClickCondition', boolean)
  },
  setActiveGroupPlaceId: ({ commit }, placeIds) => {
    commit('setActiveGroupPlaceId', placeIds)
  },
  goToDefaultView ({ rootState, state }) {
    const viewpointPosition = state.viewpointPosition
    const { position: currentViewpoint } = state.mapviewer.camera
    const currentFloorID = rootState.visioglobe.venue.currentFloorID
    const floorWithTerminal = rootState.terminals.terminalPOI.options('floor')

    if (
      viewpointPosition.x === Math.round(currentViewpoint.x) &&
      viewpointPosition.y === Math.round(currentViewpoint.y) &&
      viewpointPosition.radius === Math.round(currentViewpoint.radius) &&
      currentFloorID === floorWithTerminal
    ) return

    return state.multiBuildingView.goTo({
      mode: 'floor',
      animationDuration: 0.3,
      floorID: floorWithTerminal,
      viewpoint: {
        position: viewpointPosition
      }
    })
  }
}
