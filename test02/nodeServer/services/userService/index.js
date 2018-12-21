var jwt = require('jsonwebtoken')
const sequelize = require('../Sequelize')
const User = sequelize.Users
const Group = sequelize.Groups

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
    getAllUsers(s, f) {
      User
        .findAll()
        .then(res => {
          console.log(res.rows)
          s({ users: res.rows })
        })
        .catch(error => {
          f({ message: '获取失败', err: error })
        })
    },
    async getUserByname(name) {
      try {
        let user = await User.findOne({ where: {
          name: name
        },
        attributes: ['name', 'id', 'email'] })
        return { msg: 'ok', user: user }
      } catch (error) {
        return { msg: '获取用户信息失败', err: error }
      }
    },
    async getUsersByPage(page) {
        try {
          if (page) {
          let offset = parseInt((page.page - 1) * page.size)
          let size = parseInt(page.size)
          console.log(page.size)
            let res = await User.findAndCountAll({ attributes: ['name', 'id', 'email', 'remark'], limit: size, offset: offset })
            let users = res.rows
            let count = res.count
            return { users, count }
          } else {
            let users = await User.findAll()
            return { users }
          }
        } catch (error) {
          console.log(error)
            return { err: error }
        }
    },
    async login(username, password) {
      try {
          let user = await User.find({ where: {
            name: username,
            password: password
          } })

          console.log(user.id)
          if (user) {
            let remark = user.remark
            let id = user.id
            const token = createToken(username, password, remark, id)
            loginLogger.info(`用户(${remark}):${username} 进行了登录操作 token : ${token}`)
            return { token: token, message: 'ok', remark: remark }
          } else {
            return { message: '用户或者密码错误', errcode: 2 }
          }
      } catch (error) {
          return { message: error.message, errcode: 1 }
      }
  },
    register(user, s, f) {
      User.findOrCreate({ where: [
        {
          name: user.name
        },
        {
          email: user.email
        }
      ],
      defaults: user }
      )
      .spread(async (user, created) => {
        if (created) {
          const data = await this.login(user.name, user.password)
          return s({ token: data.token, message: 'ok', remark: data.remark, errcode: 0, f: 1 })
        } else {
          return s({ message: '用户已存在', errcode: 2 })
        }
      }).catch(error => {
        console.log(error.errors)
        return f({ message: `注册错误`, errcode: 1 })
      })
    },
    async update(user) {
        try {
          const key = user.key
          const param = {}
          param[key] = user.value
          await User.update(param, {
            where: {
              id: user.id
            }
          })
          return { message: `修改成功` }
        } catch (error) {
          console.log(error)
          return { message: '修改失败', errcode: 4 }
        }
    },
    async deleteUserById(user) {
        try {
          await User.destroy({
            where: {
              id: user.id
            }
          })
          return { message: `删除成功` }
        } catch (error) {
          console.log(error)
          return { message: '删除失败', errcode: 4 }
        }
    },
    async makeFriend(uid, fid) {
      try {
        if (uid === fid) {
          return { message: `不能添加自己为好友` }
        }

        const friends = await sequelize.Friends.findAll({
          where: {
            uid,
            fid
          }
        })
        if (friends.length) {
          return { message: `已经是好友` }
        } else {
          let user = await User.findByPk(parseInt(fid))
          if (!user) {
            return { message: `用户不存在`, errcode: 6 }
          }
          await sequelize.Friends.create({ uid, fid })
          return { message: `好友添加成功` }
        }
      } catch (error) {
          return { message: `好友添加失败${error}`, errcode: 5 }
      }
    },
    async getFriendsList(uid) {
      try {
        const friendsId = await sequelize.Friends.findAll({ where: {
          uid: uid
        },
      attributes: ['fid'] })
        let friends
        if (friendsId.length) {
          friends = await User.findAll({
            where: {
              id: {
                [sequelize.Sequelize.Op.or]: friendsId.map(f => {
                  return f.fid
                })
              }
            }
          })
        }
        return friends
      } catch (error) {
        console.log(`getfriends list error ${error}`)
          return []
      }
    },
    async deleteFriend(uid, fid) {
      try {
       await sequelize.Friends.destroy({
         where: {
           uid,
           fid
         }
       })
       return { message: `好友删除成功`, errcode: 0 }
      } catch (error) {
          return { message: `好友删除失败${error}`, errcode: 5 }
      }
    },
    async getUserByIds(ids) {
      console.log(`按id 找名字 ${ids}`)
      try {
        const friends = await User.findAll({
          where: {
            id: {
              [sequelize.Sequelize.Op.or]: ids
            }
          }
        })
        return friends
      } catch (error) {
        console.log(`按id 找名字 错误 ${error}`)
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
                        .findOrCreate({ where: { [sequelize.Sequelize.Op.or]: [
                          { number: printer.number },
                          { name: printer.name }
                        ] },
                        defaults: printer })
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
    },
    async addGroup(newgroup) {
      try {
        console.log(newgroup)
        let res = await Group.findOrCreate({
          where: {
            name: newgroup.name
          },
          default: newgroup })
          for (const key in res) {
            console.log(`key ${key}`)
          }
          // let { group, created } = { ...res }
          // console.log({ ...res })
          // console.log(typeof res[1])
          if (res[1]) {
            console.log(`添加组成功`)
            return { message: `添加组成功`, errcode: 0 }
          } else {
            console.log(`组已经存在`)
            return { message: `组已经存在`, errcode: 0 }
          }
      } catch (error) {
        console.log(`组添加错误${error}`)
          return { message: `组添加错误`, errcode: 1 }
      }
    },
    async updateGroup(group) {
      try {
        await Group
        .update({
          name: group.name
          }, {
            where: {
              id: group.id
            }
          })
          return { message: `添加组功`, errcode: 0 }
      } catch (error) {
        console.log(`组添加错误${error}`)
        return { message: `组添加错误`, errcode: 1 }
      }
    },
    async deleteGroup(group) {
      try {
        await Group.destroy({
          where: {
            id: group.id
          } })
        return { message: `删除组成功`, errcode: 0 }
      } catch (error) {
        console.log(`删除组错误${error}`)
          return { message: `删除组错误`, errcode: 1 }
      }
    },
    async getAllGroups() {
      try {
        const res = await Group.findAll()
        return { groups: res, message: `获取所有组成功`, errcode: 0 }
      } catch (error) {
        console.log(`获取所有组错误${error}`)
          return { message: `获取所有组错误`, errcode: 1 }
      }
    }
}