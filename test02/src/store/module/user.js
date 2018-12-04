import { setToken, setUser } from '@/lib/util'
import { login, register } from '@/api/user'
// STATE
const USER_NAME = 'userName'

// ACTIONS
const HANDLE_LOGIN = 'handleLogin'
const HANDLE_LOGOUT = 'handleLogout'
const HANDLE_REGISTER = 'handleRegister'

export default {
  state: {
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
        login({ username: name, password: password }).then(res => {
          if (res.data.message !== 'ok') {
            reject(res.data)
          } else {
            console.log(`登录成功 ${JSON.stringify(res)}`);
            setToken(res.data.token)
            setUser(name)
            resolve()
          }
        }).catch(err => {
          reject(new Error(`发生错误:${err}`))
        })
      })
    },
    // 注销
    [HANDLE_LOGOUT]({ commit }) {
      return new Promise((resolve, reject) => {
        setToken('')
        setUser('')
        resolve()
      })
    },
    [HANDLE_REGISTER]({ commit }, { name, password, email }) {
      return new Promise((resolve, reject) => {
        register({ username: name, password: password, mail: email }).then(res => {
          if (res.data.message !== 'ok') {
            reject(res.data)
          } else {
            setToken(res.token)
            setUser(name)
            resolve()
          }
        }).catch(err => {
          reject(new Error(`发生错误:${err}`))
        })
      })
    }
  }
}