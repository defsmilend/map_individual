import { map } from './modules/map/index'
import visioglobePlaces from './modules/visioglobePlaces/index'
import Vuex from 'vuex'

const store = new Vuex.Store({
    modules:{
        map,
        visioglobePlaces
    }
})

export default store