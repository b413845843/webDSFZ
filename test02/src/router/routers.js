let MainLayout = () => import('@/layout/iview/main-layout')
let PrinterInfoView = () => import('@/layout/iview/printer-info-view')
let LoginView = () => import('@/layout/iview/login-view')
let error404 = () => import('@/layout/iview/error-pages/404.vue')
let error401 = () => import('@/layout/iview/error-pages/401.vue')

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
