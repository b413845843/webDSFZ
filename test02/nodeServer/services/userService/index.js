var userDao = require('./userDao.js')
var jwt = require('jsonwebtoken')

const config = require('../../config/jwt_config')
const loggerFactory = require('../../log/log4js')

const loginLogger = loggerFactory.getLogger('login')

function creaetToken (name, password) {
  const token = jwt.sign({ name, password }, config.jwtsecret, {
    expiresIn: 60 * 60 * 24// 授权时效24小时
  })
  return token
}

module.exports = {
  // 原始数据
  async getAllUsers() {
    try {
      return await userDao.getAllUsers()
    } catch (error) {
      return { err: error }
    }
  },
  // 登录注销
  async login(username, password) {
    try {
      let users = await userDao.getAllUsers()
      if (users && users.length) {
        for (let i = 0; i < users.length; i++) {
          if (users[i].username === username && users[i].password === password) {
            const token = creaetToken(username, password)
            loginLogger.info(`用户:${username} 进行了登录操作 token : ${token}`)
            return { token: token, message: 'ok' }
          }
        }
      }
      return { message: '用户或者密码错误', errcode: 2 }
    } catch (error) {
      return { message: error.message, errcode: 1 }
    }
  },
  async register(username, password, mail) {
    if (username === '' || password === '' || mail === '') {
      return { message: '注册信息有误', errcode: 3 }
    }
    try {
      const users = await userDao.getUserByname(username)
      let user = users[0]
      console.log(`find user ${user}`);

      if (user && user.username) {
        return { message: '用户已存在' }
      } else {
        const id = await userDao.addUser(username, password, mail)
        if (id) {
          const token = creaetToken(username, password)
          return { token: token, message: 'ok' }
        } else {
          return { message: '注册失败' }
        }
      }
    } catch (error) {
      return { message: error.message, errcode: 2 }
    }
  },
  async update(user) {
    try {
      const result = await userDao.updateUser(user)
      loginLogger.info(JSON.stringify(result))
      return { message: `修改成功` }
    } catch (error) {
      return { message: '修改失败', errcode: 4 }
    }
  }
}