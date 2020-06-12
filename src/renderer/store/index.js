import Vue from 'vue'
import Vuex from 'vuex'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'
Vue.use(Vuex)

export default new Vuex.Store({
    modules,
    // plugins: [
    //   createPersistedState(),
    //   createSharedMutations()
    // ],

    // strict: process.env.NODE_ENV !== 'production'
    // fixme 生产环境需要改为false，防止深度检测，提高性能
    strict: false
})
