var pool = require('./db')
const table = 'user'

const selectAll = `SELECT * FROM ${table}`
const selectByName = `SELECT * FROM ${table} where username = ?`
const inserUser = `INSERT INTO ${table}(username,password,mail) VALUES(?,?,?)`

let userDao = {
  getAllUser() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        con.query(selectAll, (err, result) => {
          if (err) {
            console.log(`[select error] - ${err.message}`);
            reject(err)
          } else {
            console.log('--------------------------SELECT ALL----------------------------');
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
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
  }
}

module.exports = userDao