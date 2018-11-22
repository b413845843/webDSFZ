import Vue from 'vue/dist/vue.js'
import Router from 'vue-router'
import MainLayout from '@/layout/iview/main-layout'
import PrinterInfoView from '@/layout/iview/printer-info-view'
import LoginView from '@/layout/iview/login-view'
Vue.use(Router)

const Foo = {
    template: '<div class="foo">foo</div>'
}
const Bar = {
    template: '<div class="bar">bar</div>'
}

export default new Router({
    routes: [{
            path: '/',
            component: LoginView,
            meta: {
                title: '登录'
            },
            alias: '/login'
        },
        {
            path: '/manager',
            component: MainLayout,
            children: [{
                    path: '',
                    component: PrinterInfoView,
                    meta: {
                        title: '信息',
                        bread: ['数据管理', '打印机管理']
                    },
                    alias: 'printerInfo'
                },
                {
                    path: 'foo',
                    component: Foo
                },
                {
                    path: 'bar',
                    component: Bar
                }
            ]
        }
    ]
})