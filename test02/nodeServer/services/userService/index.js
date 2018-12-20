var userDao = require('./userDao.js')
var friendDao = require('./friendDao.js')
var jwt = require('jsonwebtoken')
const sequelize = require('../Sequelize')

const config = require('../../config/jwt_config')
const loggerFactory = require('../../log/log4js')

const loginLogger = loggerFactory.getLogger('login')

function createToken(name, password, remark, id) {
    const token = jwt.sign({ name, password, remark, id }, config.jwtsecret, {
        expiresIn: 60 * 60 * 24 // 授权时效24小时
    })
    return token
}

module.exports = {
    // 原始数据
    async getAllUsers() {
        try {
            let users = await userDao.getAllUsers()
            return { users }
        } catch (error) {
            return { err: error }
        }
    },
    async getUserByname(name) {
      try {
        let user = await userDao.getUserByname(name)
        return { msg: 'ok', user: user[0] }
      } catch (error) {
        return { msg: '获取用户信息失败', err: error }
      }
    },
    async getUsersByPage(page) {
        try {
            let users = await userDao.getUsersByPage(page)
            let count = await userDao.usersCount()
            return { users, count }
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
                        let remark = users[i].remark
                        let id = users[i].id
                        const token = createToken(username, password, remark, id)
                        loginLogger.info(`用户(${remark}):${username} 进行了登录操作 token : ${token}`)
                        return { token: token, message: 'ok', remark: remark }
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
                    const data = await this.login(username, password)
                    return { token: data.token, message: 'ok', remark: data.remark }
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
    },
    async deleteUserById(id) {
        try {
            const result = await userDao.deleteUserById(id)
            loginLogger.info(JSON.stringify(result))
            return { message: `删除成功` }
        } catch (error) {
            return { message: '删除失败', errcode: 4 }
        }
    },
    async makeFriend(uid, fid) {
      try {
        if (uid === fid) {
          return { message: `不能添加自己为好友` }
        }

        const friends = await friendDao.findFriend(uid, fid)
        if (friends.length) {
          return { message: `已经是好友` }
        } else {
          let users = await userDao.getUserByIds([fid])
          if (users.length !== 1) {
            return { message: `用户不存在`, errcode: 6 }
          }
          await friendDao.makeFriend(uid, fid)
          return { message: `好友添加成功` }
        }
      } catch (error) {
          return { message: `好友添加失败${error}`, errcode: 5 }
      }
    },
    async getFriendsList(uid) {
      try {
        const friends = await friendDao.getFriend(uid)
        return friends
      } catch (error) {
        console.log(`getfriends list error ${error}`)
          return []
      }
    },
    async deleteFriend(uid, fid) {
      try {
       await friendDao.deleteFriend(uid, fid)
       return { message: `好友删除成功`, errcode: 0 }
      } catch (error) {
          return { message: `好友删除失败${error}`, errcode: 5 }
      }
    },
    async getUserByIds(ids) {
      console.log(`按id 找名字`)
      try {
        const friends = await userDao.getUserByIds(ids)
        return friends
      } catch (error) {
          return []
      }
    },
    async getAllPrinters(s, f) {
      sequelize.Printer
                        .findAndCountAll()
                        .then(res => {
                          console.log(`获取打印机成功`)
                         s({ message: `获取打印机成功`, errcode: 0, printers: res.rows, count: res.count })
                        }).catch(error => {
                          console.log(`获取失败${error}`)
                          f({ message: `获取失败打印机`, errcode: 1 })
                        })
    },
    addPrinter(printer, s, f) {
      sequelize.Printer
                        .findOrCreate({ where: { number: printer.number }, defaults: printer })
                        .spread((printer, created) => {
                          console.log(sequelize.Printer.getTableName({
                            plain: true
                          }))
                          console.log(created)

                          if (created) {
                            console.log(`添加打印机成功`)
                            s({ message: `添加打印机成功`, errcode: 0 })
                          } else {
                            console.log(`打印机已经添加过了`)
                            f({ message: `打印机已经添加过了`, errcode: 0 })
                          }
                        })
    },
    deletePrinter(printer, s, f) {
      sequelize.Printer
                    .destroy({ where: {
                      id: printer.id
                    } })
                    .then(res => {
                      s({ message: `打印机删除成功`, errcode: 0 })
                    })
                    .catch(error => {
                      console.log(`打印机删除错误 ${error}`);
                      f({ message: `打印机删除错误`, errcode: 0 })
                    })
    }
}