import Vuex from 'vuex'
import Vue from 'vue/dist/vue.js'

import app from './module/app'
import user from './module/user'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    user
  }
})