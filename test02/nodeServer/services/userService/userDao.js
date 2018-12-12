var pool = require('../db.js')
const table = 'user'

const selectAll = `SELECT * FROM ${table}`
const selectByName = `SELECT * FROM ${table} where username = ?`
const inserUser = `INSERT INTO ${table}(username,password,mail) VALUES(?,?,?)`
const deleteUser = `DELETE FROM ${table} where id=?`
const allCount = `SELECT COUNT(*) AS count FROM ${table}`
// const selectPage = `SELECT * FROM ${table} WHERE id>=? ORDER BY id ASC LIMIT 0,?`
// const updateUser = `UPDATE ${table} SET ?=? WHERE id=?`
let userDao = {
  usersCount() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(`SELECT FOUND_ROWS() AS count`, (err, result) => {
          if (err) {
            console.log(`[user count error] - ${err.message}`);
            reject(err)
          } else {
            console.log('--------------------------COUNT ALL----------------------------\n');
            console.log(result);
            console.log('------------------------------------------------------------\n');
            resolve(result[0]['count'])
          }
          con.release()
        })
      })
    })
  },
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
  getUsersByPage(page) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(`SELECT SQL_CALC_FOUND_ROWS * FROM ${table}` + ` ORDER BY id ASC LIMIT ` + page.size * (page.page - 1 <= 0 ? 0 : page.page - 1) + `, ${page.size}`, (err, result) => {
          if (err) {
            console.log(`[select page error] - ${err.message}`);
            reject(err)
          } else {
            console.log('--------------------------SELECT PAGE----------------------------\n');
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
  },
   deleteUserById(id) {
     console.log(`id ${id.id}`);
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(deleteUser, [id.id], (err, result) => {
          if (err) {
            console.log(`[delete user] - ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------DELETE USER----------------------------`);
            console.log('DELETE affectedRows', result.affectedRows);
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
