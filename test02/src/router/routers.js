import MainLayout from '@/layout/iview/main-layout'
import PrinterInfoView from '@/layout/iview/printer-info-view'
import LoginView from '@/layout/iview/login-view'
import error401 from '@/layout/iview/error-pages/401.vue'
import error404 from '@/layout/iview/error-pages/404.vue'
const Foo = {
  template: '<div class="foo">foo</div>'
}
const Bar = {
  template: '<div class="bar">bar</div>'
}

export default [{
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    name: '_home',
    component: MainLayout,
    redirect: '/home',
    children: [{
        path: '/home',
        name: 'home',
        component: PrinterInfoView,
        meta: {
          title: '首页'
        }
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
  },
  {
    path: '/401',
    name: 'error_401',
    component: error401
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: error404
  }
]