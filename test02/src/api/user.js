import service from '@/tools/request.js';

const baseUrl = process.env.NODE_ENV === 'development' ? '/dev/users' : '/users'

const loginUrl = process.env.NODE_ENV === 'development' ? '/dev/token' : '/token'
const registerUrl = baseUrl + '/register'
const getAllUsersUrl = baseUrl + '/getAllUsers'
const updateUserUrl = baseUrl + '/update'
const deleteUserUrl = baseUrl + '/delete'

let userService = {
  dingding(message) {
    return service({
      url: '/ding/robot/send?access_token=c36a71fce0a28ed3b9b3c85a93a34845534c92a6cad1d4b3ee6409ad7366dac5',
      method: 'post',
      data: {
        'msgtype': 'text',
        'text': {
            'content': message
        }
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
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
  getAllUsers(page) {
    return service({
      url: getAllUsersUrl,
      method: 'get',
      params: page
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
