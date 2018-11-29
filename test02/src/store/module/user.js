import { setToken } from '@/lib/util'

// STATE
const USER_NAME = 'userName'

// ACTIONS
const HANDLE_LOGIN = 'handleLogin'
const HANDLE_LOGOUT = 'handleLogout'

export default {
  state: {
    userName: ''
  },
  mutations: {
    [USER_NAME](state, userName) {
      state.userName = userName
    }
  },
  actions: {
    // 登陆
    [HANDLE_LOGIN]({ commit }, { name, password }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (name !== '' && password === '123') {
            commit(USER_NAME, name)
            setToken(name)
            resolve()
          } else {
            reject(new Error('密码或账号错误'))
          }
        }, 500);
      })
    },
    // 注销
    [HANDLE_LOGOUT]({ commit }) {
      return new Promise((resolve, reject) => {
        commit(USER_NAME, '')
        setToken('')
        resolve()
      })
    }
  }
}