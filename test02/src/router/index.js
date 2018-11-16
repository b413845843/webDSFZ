import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import ManagerLayout from '@/layout/managerLayout'
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            component: HelloWorld
        },
        {
            path: '/usermanager',
            component: ManagerLayout
        }
    ]
})