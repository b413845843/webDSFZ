var pool = require('../db.js')
const table = 'friendships'
const makeFriend = `INSERT INTO ${table}(uid,fid) VALUES(?,?)`
const findFriend = `SELECT * FROM ${table} where uid = ? AND fid = ?;`
const getFriendList = `SELECT fid FROM ${table} where uid = ? ;`
const deleteFriend = `DELETE FROM ${table} where uid = ? AND fid = ?;`
let friendDao = {
  makeFriend(uid, fid) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(makeFriend, [uid, fid], (err, result) => {
          if (err) {
            console.log(`[inser friend] - ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------INSER FRIEND----------------------------`);
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  },
  findFriend(uid, fid) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(findFriend, [uid, fid], (err, result) => {
          if (err) {
            console.log(`[find friend] - ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------FIND FRIEND----------------------------`);
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  },
  getFriend(uid, fid) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(getFriendList, [uid], (err, result) => {
          if (err) {
            console.log(`GET FRIEND list error - ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------GET FRIEND list----------------------------`);
            console.log(result);
            console.log('------------------------------------------------------------\n\n');
            resolve(result)
          }
          con.release()
        })
      })
    })
  },
  deleteFriend(uid, fid) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, con) => {
        if (err) {
          reject(err)
          return
        }
        con.query(deleteFriend, [uid, fid], (err, result) => {
          if (err) {
            console.log(`Delete Freind error- ${err.message}`);
            reject(err)
          } else {
            console.log(`--------------------------Delete Freind----------------------------`);
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

module.exports = friendDao