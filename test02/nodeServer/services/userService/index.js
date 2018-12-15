var userDao = require('./userDao.js')
var jwt = require('jsonwebtoken')

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
            let count = await userDao.usersCount()
            return { users, count }
        } catch (error) {
            return { err: error }
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
    }
}