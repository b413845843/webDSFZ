const Sequelize = require('sequelize')
const config = require('../config.js')
const path = require('path')

function getPath(p) {
  return path.join(__dirname, p)
}

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: config.pool,
  charset: 'utf8'
})

sequelize
  .authenticate()
  .then(() => {
    console.log(`sequelize 连接成功`)
  })
  .catch(err => {
    console.log(`sequelize 连接失败 ${err}`)
  })

const Users = sequelize.import(getPath('/models/users'))

const Friends = sequelize.import(getPath('/models/friends'))

const Printer = sequelize.import(getPath('/models/printers'))

const Groups = sequelize.import(getPath('/models/groups'))

const Group_user = sequelize.import(getPath('/models/group_user'))

const Group_printer = sequelize.import(getPath('/models/group_printer'))

sequelize.sync()
  .then(() => {
    console.log(`表同步`)
  })
  .catch(err => {
    console.log(`表同步出错 ${err}`)
  })

module.exports = {
  Printer,
  Users,
  Friends,
  Groups,
  Group_user,
  Group_printer,
  Sequelize
}
