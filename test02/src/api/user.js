import service from '@/tools/request.js';

const baseUrl = process.env.NODE_ENV === 'development' ? '/dev/users' : '/users'

const loginUrl = process.env.NODE_ENV === 'development' ? '/dev/token' : '/token'
const registerUrl = baseUrl + '/register'
const getAllUsersUrl = baseUrl + '/getAllUsers'
const updateUserUrl = baseUrl + '/update'
const deleteUserUrl = baseUrl + '/delete'
const getUserInfoUrl = baseUrl + '/getUserInfo'
const makeFriendUrl = baseUrl + '/makeFriend'
const deleteFriendUrl = baseUrl + '/deleteFriend'

const addPrinterUrl = baseUrl + '/addPrinter'
const getAllPrintersUrl = baseUrl + '/getAllPrinters'
const deletePrinterUrl = baseUrl + '/deletePrinter'
const addGroupUrl = baseUrl + '/addGroup'
const getAllGroupsUrl = baseUrl + '/getAllGroups'
const deleteGroupUrl = baseUrl + '/deleteGroup'
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
  makeFriend(uid, fid) {
    return service({
      url: makeFriendUrl,
      method: 'post',
      data: {
        uid,
        fid
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  deleteFriend(uid, fid) {
    return service({
      url: deleteFriendUrl,
      method: 'post',
      data: {
        uid,
        fid
      },
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
  getUserInfo() {
    return service({
      url: getUserInfoUrl,
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
  },
  addPrinter(printer) {
    return service({
      url: addPrinterUrl,
      method: 'post',
      data: printer
    })
  },
  getAllPrinters() {
    return service({
      url: getAllPrintersUrl,
      method: 'get'
    })
  },
  deletePrinter(printer) {
    return service({
      url: this.deletePrinterUrl,
      method: 'post',
      data: printer
    })
  },
  addGroup(group) {
    return service({
      url: addGroupUrl,
      method: 'post',
      data: group
    })
  },
  getAllGroups() {
    return service({
      url: getAllGroupsUrl,
      method: 'get'
    })
  },
  deleteGroup(group) {
    return service({
      url: deleteGroupUrl,
      method: 'post',
      data: group
    })
  }
}

export default userService
