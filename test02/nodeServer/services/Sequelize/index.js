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
  pool: config.pool
})

sequelize
  .authenticate()
  .then(() => {
    console.log(`sequelize 连接成功`)
  })
  .catch(err => {
    console.log(`sequelize 连接失败 ${err}`)
  })

const Printer = sequelize.import(getPath('/models/printers'))
// Printer.sync()
//   .then(() => {
//     console.log(`printer 表同步`)
//   })
//   .catch(err => {
//     console.log(`printer 表同步出错 ${err}`)
//   })

// const User = sequelize.import(getPath('/models/users'))
// User.sync()
//   .then(() => {
//     console.log(`User 表同步`)
//   })
//   .catch(err => {
//     console.log(`User 表同步出错 ${err}`)
//   })

// const Friends = sequelize.import(getPath('/models/friends'))
// Friends.sync()
//   .then(() => {
//     console.log(`Friends 表同步`)
//   })
//   .catch(err => {
//     console.log(`Friends 表同步出错 ${err}`)
//   })

const Groups = sequelize.import(getPath('/models/groups'))
// Groups.sync()
//   .then(() => {
//     console.log(`Groups 表同步`)
//   })
//   .catch(err => {
//     console.log(`Groups 表同步出错 ${err}`)
//   })

const Group_user = sequelize.import(getPath('/models/group_user'))
// Group_user.sync()
//   .then(() => {
//     console.log(`Group_user 表同步`)
//   })
//   .catch(err => {
//     console.log(`Group_user 表同步出错 ${err}`)
//   })

const Group_printer = sequelize.import(getPath('/models/group_printer'))
// Group_printer.sync()
//   .then(() => {
//     console.log(`Group_printer 表同步`)
//   })
//   .catch(err => {
//     console.log(`Group_printer 表同步出错 ${err}`)
//   })

sequelize.sync()
  .then(() => {
    console.log(`表同步`)
  })
  .catch(err => {
    console.log(`表同步出错 ${err}`)
  })
module.exports = {
  Printer,
  // User,
  // Friends,
  Groups,
  Group_user,
  Group_printer
}
