import service from '@/tools/request.js';

const baseUrl = process.env.NODE_ENV === 'development' ? '/dev/users' : '/users'

const loginUrl = baseUrl + '/login'
const registerUrl = baseUrl + '/register'
const getAllUsersUrl = baseUrl + '/getAllUsers'
const updateUserUrl = baseUrl + '/update'

export function login(user) {
  return service({
    url: loginUrl,
    method: 'post',
    data: user,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function register(user) {
  return service({
    url: registerUrl,
    method: 'post',
    data: user,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export function getAllUsers() {
  return service({
    url: getAllUsersUrl,
    method: 'get'
  })
}

export function updateUser(user) {
  return service({
    url: updateUserUrl,
    method: 'post',
    data: user
  })
}