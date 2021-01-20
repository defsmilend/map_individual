// import { GetterTree } from 'vuex'

const getters = {
  sidebar: (state, getters, rootState) => {
    if (rootState.config) {
      const { sidebar } = rootState.config.visioglobe
      return state.sidebarServices.filter(({code}) => sidebar.includes(code))
    }
  },
  getMapPointsByCategory: state => category => {
    const stateCategory = state.services.find((el) => el.parent_id === category.parent_id)
    return stateCategory.mapPoints.filter((point) => {
      return Boolean(point.categories
        .find(el => el.name === category.name))
    })
  }
}
export default getters
