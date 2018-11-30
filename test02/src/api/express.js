import service from '@/tools/request.js';

const pBaseUrl = '/api'
const getHello = pBaseUrl + '/hello'
export function hello() {
  return service({
    url: `${getHello}`,
    method: 'get'
  });
}