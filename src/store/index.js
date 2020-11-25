import Vue from 'vue'
import Vuex from 'vuex'
import main from './main/index'

Vue.use(Vuex)

export function createStore() {
    return new Vuex.Store({
        modules: {
            main
        }
    })
}