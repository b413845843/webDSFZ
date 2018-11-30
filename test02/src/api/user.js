export function getAllUsers() {
  return service({
    url: 'http://localhost:3000/users',
    method: 'get'
  });
}