import service from '@/tools/request.js';

const baseUrl = process.env.NODE_ENV === 'development' ? '/dev/users' : '/users'

const loginUrl = process.env.NODE_ENV === 'development' ? '/dev/token' : '/token'
const registerUrl = baseUrl + '/register'
const getAllUsersUrl = baseUrl + '/getAllUsers'
const updateUserUrl = baseUrl + '/update'
const deleteUserUrl = baseUrl + '/delete'

let userService = {
  login(user) {
    return service({
      url: loginUrl,
      method: 'post',
      data: user,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  register(user) {
    return service({
      url: registerUrl,
      method: 'post',
      data: user,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  getAllUsers() {
    return service({
      url: getAllUsersUrl,
      method: 'get'
    })
  },
  updateUser(user) {
    return service({
      url: updateUserUrl,
      method: 'post',
      data: user
    })
  },
  deleteUserById(id) {
    return service({
      url: deleteUserUrl,
      method: 'post',
      data: { id: id }
    })
  }
}

export default userService
