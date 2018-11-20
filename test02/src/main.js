// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue/dist/vue.js'
import App from './App'
import iviewRouter from './router/iviewIndex.js'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import './index.less'

import dotLink from '@/layout/iview/component/dotLink/dotLink'
import nodeView from '@/layout/iview/component/nodeView'
import configView from '@/layout/iview/component/configView'
import printView from '@/layout/iview/component/printView'
import moreInfoRow from '@/layout/iview/component/moreInfoRow'

Vue.config.productionTip = false

Vue.use(iView)
Vue.component('dot-link', dotLink)
Vue.component('node-view', nodeView)
Vue.component('config-view', configView)
Vue.component('print-view', printView)
Vue.component('more-info-row', moreInfoRow)

iviewRouter.beforeEach((to, from, next) => {
  NProgress.start()
  window.document.title = to.meta.title
  next()
})

iviewRouter.afterEach(() => {
  NProgress.done()
})

export default new Vue({
  el: '#app',
  router: iviewRouter,
  components: {
    App
  },
  template: '<App/>'
})