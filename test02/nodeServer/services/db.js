let mysql = require('mysql')
let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.NODE_ENV === 'dev' ? 'a741741' : 'a741741',
  port: '3306',
  database: 'dascom'
})

module.exports = pool