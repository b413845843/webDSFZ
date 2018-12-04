import service from '@/tools/request.js';

const baseUrl = process.env.NODE_ENV === 'development' ? '/dev/users' : '/users'

const loginUrl = baseUrl + '/login'
const registerUrl = baseUrl + '/register'

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