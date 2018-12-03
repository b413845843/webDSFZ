var userDao = require('../database/userDao')

module.exports = {
  async login(username, password) {
    try {
      let users = await userDao.getAllUser()
      if (users && users.length) {
        for (let i = 0; i < users.length; i++) {
          if (users[i].username === username && users[i].password === password) {
            return { token: '123token', msg: 'ok' }
          }
        }
      }
      return { msg: '用户或者密码错误', errcode: 2 }
    } catch (error) {
      return { msg: error.message, errcode: 1 }
    }
  },
  async register(username, password, mail) {
    try {
      const users = await userDao.getUserByname(username)
      let user = users[0]
      console.log(`find user ${user}`);

      if (user && user.username) {
        return { msg: '用户已存在' }
      } else {
        const id = await userDao.addUser(username, password, mail)
        if (id) {
          return { token: '123token', msg: 'ok' }
        } else {
          return { msg: '注册失败' }
        }
      }
    } catch (error) {
      return { msg: error.message, errcode: 2 }
    }
  }
}