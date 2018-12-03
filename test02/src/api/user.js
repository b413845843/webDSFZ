import service from '@/tools/request.js';

const baseUrl = '/users'
const getAllUsersUrl = baseUrl + '/getAllUsers'
const loginUrl = baseUrl + '/login'
const registerUrl = baseUrl + '/register'

export function getAllUsers() {
  return service({
    url: getAllUsersUrl,
    method: 'get'
  });
}

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