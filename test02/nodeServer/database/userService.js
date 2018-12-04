var userDao = require('../database/userDao')
var jwt = require('jsonwebtoken')

const config = require('../config/jwt_config')
const loggerFactory = require('../log/log4js')

const loginLogger = loggerFactory.getLogger('login')

function creaetToken (name, password) {
  const token = jwt.sign({ name, password }, config.jwtsecret, {
    expiresIn: 60 * 60 * 24// 授权时效24小时
  })
  return token
}

module.exports = {
  async login(username, password) {
    try {
      let users = await userDao.getAllUser()
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
  }
}