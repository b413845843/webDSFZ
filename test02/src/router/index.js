import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'
import NProgress from 'nprogress'

import routes from './routers'
// import store from '@/store/'
import { getToken } from '@/lib/util'

const LOGIN_PAGE_NAME = 'login'

Vue.use(Router)

let router = new Router({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    NProgress.start()

    const token = getToken()
        // console.log(to);

    // console.log(`to:${to.name} name:${store.state.user.userName} token:${token}`);
    if (!token && to.name !== LOGIN_PAGE_NAME) {
        console.log('没登录且不是登录页面 正在跳转到login');
        next({ name: LOGIN_PAGE_NAME })
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
        console.log('正在跳转到login');
        next()
    } else if (token && to.name === LOGIN_PAGE_NAME) {
        console.log('正在跳转到home');
        next({ name: 'home' })
    } else {
        if (token) {
            next()
        } else {
            next({ name: 'error_404', replace: true })
        }
    }
})

router.afterEach(() => {
    console.log('跳转结束');
    NProgress.done()
})

export default router