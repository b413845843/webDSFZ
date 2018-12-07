var pool = require('../db.js')
const table = 'user'

const selectAll = `SELECT * FROM ${table}`
const selectByName = `SELECT * FROM ${table} where username = ?`
const inserUser = `INSERT INTO ${table}(username,password,mail) VALUES(?,?,?)`
// const updateUser = `UPDATE ${table} SET ?=? WHERE id=?`
let userDao = {
  getAllUsers() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(selectAll, (err, result) => {
          if (err) {
            console.log(`[select error] - ${err.message}`);
            reject(err)
          } else {
            console.log('--------------------------SELECT ALL----------------------------\n');
            console.log(result);
            console.log('------------------------------------------------------------\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  },
  getUserByname(name) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(selectByName, [name], (err, result) => {
          if (err) {
            console.log(`[select one error] - ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------SELECT BY NAME ${name}----------------------------`);
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  },
  addUser(username, password, mail) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(inserUser, [username, password, mail], (err, result) => {
          if (err) {
            console.log(`[inser user] - ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------INSER USER----------------------------`);
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  },
  updateUser(user) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        let sql = `UPDATE ${table} SET ` + user.key + `=? WHERE id=?`
        con.query(sql, [user.value, user.id], (err, result) => {
          if (err) {
            console.log(`[update user] - ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------UPDATE USER----------------------------`);
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  }
}

module.exports = userDao
