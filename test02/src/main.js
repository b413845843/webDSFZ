// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue/dist/vue.js'
import App from './App'
import router from './router/'
import i18n from '@/locale'
import store from '@/store'

import 'nprogress/nprogress.css'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import './index.less'

import dotLink from '@/layout/iview/component/dot-link'
import nodeView from '@/layout/iview/component/node-view'
import configView from '@/layout/iview/component/config-view'
import printView from '@/layout/iview/component/print-view'
import moreInfoRow from '@/layout/iview/component/more-info-row'
import nodeViewModal from '@/layout/iview/component/node-view-modal'

Vue.config.productionTip = false

Vue.component('dot-link', dotLink)
Vue.component('node-view', nodeView)
Vue.component('config-view', configView)
Vue.component('print-view', printView)
Vue.component('more-info-row', moreInfoRow)
Vue.component('node-view-modal', nodeViewModal)
Vue.use(iView)

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

export default new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: {
    App
  },
  template: '<App/>'
})