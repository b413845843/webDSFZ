import Cookies from 'js-cookie'

const cookieExpires = 1

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token && token !== undefined) {
    return token
  } else {
    return false
  }
}