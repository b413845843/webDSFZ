const User = require('../index').User

let service = {
  getAll(success, fail) {
    User.findAll()
      .then(users => {
        success(users)
      })
      .catch(err => {
        fail(err)
      })
  },
  addUser(user, success, fail) {
    User
      .findOrCreate({ where: { name: user.name } })
      .spread((user, created) => {
        if (created) {
          success({ msg: 'ok', errCode: 0 })
        } else {
          success({ msg: 'fail', errCode: 1 })
        }
      })
  }
}

module.exports = service