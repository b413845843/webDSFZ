let MainLayout = () => import('@/layout/iview/main-layout')
let PrinterInfoView = () => import('@/layout/iview/printer-info-view')
let LoginView = () => import('@/layout/iview/login-view')
let error404 = () => import('@/layout/iview/error-pages/404.vue')
let error401 = () => import('@/layout/iview/error-pages/401.vue')
let userManagerView = () => import('@/layout/iview/user-manager-view')
let chatView = () => import('@/layout/iview/chat-view')
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
        path: 'usersManager',
        name: 'usersManager',
        component: userManagerView,
        meta: {
          title: '用户管理'
        }
      },
      {
        path: 'chat',
        name: 'chat',
        component: chatView,
        meta: {
          title: '聊天室'
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
