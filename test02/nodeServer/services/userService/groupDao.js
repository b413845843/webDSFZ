var pool = require('../db.js')
const table = 'groups'

const selectAll = `SELECT * FROM ${table}`
const selectByName = `SELECT * FROM ${table} where name = ?`
const inserGroup = `INSERT INTO ${table}(name) VALUES(?,?,?)`
const deleteGroup = `DELETE FROM ${table} where id=?`
// const selectPage = `SELECT * FROM ${table} WHERE id>=? ORDER BY id ASC LIMIT 0,?`
// const updateUser = `UPDATE ${table} SET ?=? WHERE id=?`
let groupDao = {
  getAllGroups() {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(selectAll, (err, result) => {
          if (err) {
            console.log(`[select group error] - ${err.message}`);
            reject(err)
          } else {
            console.log('--------------------------SELECT ALL group----------------------------\n');
            console.log(result);
            console.log('------------------------------------------------------------\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  },
  getGroupsByPage(page) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(`SELECT SQL_CALC_FOUND_ROWS * FROM ${table}` + ` ORDER BY id ASC LIMIT ` + page.size * (page.page - 1 <= 0 ? 0 : page.page - 1) + `, ${page.size}`, (err, result) => {
          if (err) {
            console.log(`[select group page error] - ${err.message}`);
            reject(err)
          } else {
            console.log('--------------------------SELECT group PAGE----------------------------\n');
            console.log(result);
            console.log('------------------------------------------------------------\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  },
  getGroupByname(name) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(selectByName, [name], (err, result) => {
          if (err) {
            console.log(`[select group error] - ${err.message}`);
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
  addGroup(name) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(inserGroup, [name], (err, result) => {
          if (err) {
            console.log(`[inser group] - ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------INSER group----------------------------`);
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  },
  updateGroup(group) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        let sql = `UPDATE ${table} SET ` + group.key + `=? WHERE id=?`
        con.query(sql, [group.value, group.id], (err, result) => {
          if (err) {
            console.log(`[update group] - ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------UPDATE group----------------------------`);
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  },
   deleteGroupById(id) {
     console.log(`id ${id.id}`);
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(deleteGroup, [id.id], (err, result) => {
          if (err) {
            console.log(`[delete group] - ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------DELETE group----------------------------`);
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

module.exports = groupDao
