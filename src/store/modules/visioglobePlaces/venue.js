import _ from 'lodash'

const state = {
  layout: null,
  currentExploreMode: '',
  currentBuildingID: '',
  currentFloorID: ''
}

const getters = {
  buildingIDs (state) {
    if (state.layout !== null) {
      return Object.keys(state.layout.buildingByID)
    }
    return []
  },
  buildings: (state, getters, rootState) => {
    if (state.layout !== null && rootState.visioglobe.multiBuildingView !== null) {
      return getters.buildingIDs.map(id => {
        return {
          value: id,
          text: rootState.visioglobe.multiBuildingView.getLocalizedName(id)
        }
      })
    }
    return []
  },
  floorsByBuilding: (state, getters, rootState) => {
    if (state.layout !== null && rootState.visioglobe.multiBuildingView !== null) {
      const floorsByBuilding = {}
      getters.buildingIDs.forEach(buildingID => {
        let sortedFloors = _.sortBy(state.layout.buildingByID[buildingID].floors, 'levelIndex')
        if (rootState.visioglobe.parameters.ui.exploration.type === 'selectors') {
          sortedFloors = _.reverse(sortedFloors)
        }
        floorsByBuilding[buildingID] = sortedFloors.map(floor => {
          return {
            level: floor.levelIndex + 1 === 0 ? floor.levelIndex : floor.levelIndex + 1,
            value: floor.id,
            text: rootState.visioglobe.multiBuildingView.getLocalizedName(floor.id)
          }
        })
      })
      return floorsByBuilding
    }
    return {}
  },
  floors: (state, getters) => {
    if (state.layout !== null && state.currentBuildingID !== null) {
      return getters.floorsByBuilding[state.currentBuildingID]
    }
    return []
  },
  buildingNames: (state, getters, rootState) => {
    if (state.layout !== null && rootState.visioglobe.multiBuildingView !== null) {
      return _.fromPairs(_.map(Object.keys(state.layout.buildingByID), buildingID => [
        buildingID,
        rootState.visioglobe.multiBuildingView.getLocalizedName(buildingID)
      ]))
    }
    return {}
  },
  floorNames: (state, getters, rootState) => {
    if (state.layout !== null && rootState.visioglobe.multiBuildingView !== null) {
      return _.fromPairs(_.flatMap(state.layout.buildings, building => {
        return _.map(building.floors, floor => [
          floor.id,
          rootState.visioglobe.multiBuildingView.getLocalizedName(floor.id)
        ])
      }))
    }
    return {}
  },
  buildingIDByFloorID: state => {
    if (state.layout !== null) {
      return _.fromPairs(_.flatMap(state.layout.buildings, building => {
        return _.map(building.floors, floor => [
          floor.id,
          building.id
        ])
      }))
    }
    return {}
  },
  layoutHasGlobalLayer: state => {
    return (state.layout !== null && state.layout.hasGlobalLayer)
  },
  layoutGlobalLayerID: state => {
    return state.layout !== null ? state.layout.globalLayerID : ''
  }
}

const mutations = {
  setLayout: (state, layout) => {
    state.layout = layout
  },
  setCurrentBuildingID: (state, buildingID) => {
    state.currentBuildingID = buildingID
  },
  setCurrentFloorID: (state, buildingID) => {
    state.currentFloorID = buildingID
  },
  setCurrentExploreMode: (state, mode) => {
    state.currentExploreMode = mode
  }
}

const actions = {
  initVenue: ({ state, commit, rootState }) => {
    if (rootState.visioglobe.multiBuildingView !== null) {
      commit('setLayout', rootState.visioglobe.multiBuildingView.getVenueLayout())
      let currentBuildingID = 'default'
      if (state.layout.defaultBuildingIndex !== false) {
        currentBuildingID = Object.keys(state.layout.buildingByID)[state.layout.defaultBuildingIndex]
      }
      commit('setCurrentBuildingID', currentBuildingID)
      const currentBuilding = state.layout.buildingByID[currentBuildingID]
      if (rootState.terminals.terminal && rootState.terminals.terminal.floor) {
        currentBuilding.defaultFloorIndex = rootState.terminals.terminal.floor
      }
      const currentFloor = currentBuilding.floors[currentBuilding.defaultFloorIndex]
      commit('setCurrentFloorID', currentFloor.id)
    }
  },
  goToGlobal: ({ rootState }) => {
    return rootState.visioglobe.multiBuildingView.goTo({ mode: 'global' })
  },
  goToBuilding: ({ rootState }, id) => {
    const currentExploreState = rootState.visioglobe.multiBuildingView.getCurrentExploreState()
    const goToOptions = { mode: 'building' }
    if (typeof (id) !== 'undefined') {
      goToOptions.buildingID = id
    }
    switch (currentExploreState.mode) {
      case 'global':
        return rootState.visioglobe.multiBuildingView.goTo(goToOptions)
      case 'building':
        if (typeof (id) !== 'undefined' && id !== currentExploreState.buildingID) {
          return rootState.visioglobe.multiBuildingView.goTo(goToOptions)
        }
        break
      case 'floor':
        if (typeof (id) === 'undefined' || id === currentExploreState.buildingID) {
          goToOptions.buildingID = currentExploreState.buildingID
          goToOptions.floorID = currentExploreState.floorID
        }
        return rootState.visioglobe.multiBuildingView.goTo(goToOptions)
      default:
        return Promise.reject('invalid mode requested.')
    }
  },
  goToFloor: ({ rootState }, id) => {
    const viewpointPosition = rootState.visioglobe.viewpointPosition
    if (typeof (id) !== 'undefined') {
      return rootState.visioglobe.multiBuildingView.goTo({
        mode: 'floor',
        floorID: id,
        viewpoint: {
          position: viewpointPosition
        }
      })
    } else {
      return rootState.visioglobe.multiBuildingView.goTo({
        mode: 'floor',
        viewpoint: {
          position: viewpointPosition
        }
      })
    }
  },
  goToViewpoint: ({ rootState }, { position, pitch, heading }) => {
    if (rootState.visioglobe.multiBuildingView !== null) {
      return rootState.visioglobe.multiBuildingView.goTo({viewpoint: { position, pitch, heading }})
    } else {
      if (pitch !== undefined) {
        rootState.visioglobe.mapviewer.camera.pitch = pitch
      }
      if (heading !== undefined) {
        rootState.visioglobe.mapviewer.camera.heading = heading
      }
      return rootState.visioglobe.mapviewer.camera.goTo(position)
    }
  },
  goToPlace: ({ rootState }, id) => {
    return rootState.visioglobe.multiBuildingView.goTo({
      mode: 'floor',
      place: id
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
