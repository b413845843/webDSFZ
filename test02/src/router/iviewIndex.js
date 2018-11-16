import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'
import iViewLayout from '@/layout/iview/layout'
import PrinterInfo from '@/layout/iview/printerInfo'
import Login from '@/layout/iview/login'
Vue.use(Router)

const Foo = { template: '<div class="foo">foo</div>' }
const Bar = { template: '<div class="bar">bar</div>' }

export default new Router({
    routes: [{
            path: '/',
            component: Login,
            meta: {
                title: '登录'
            },
            alias: '/login',
        },
        {
            path: '/manager',
            component: iViewLayout,
            children: [{
                    path: '',
                    component: PrinterInfo,
                    meta: {
                        title: '信息',
                        bread: ['数据管理', '打印机管理']
                    },
                    alias: 'printerInfo'
                },
                { path: 'foo', component: Foo },
                { path: 'bar', component: Bar }
            ]
        }
    ]
})