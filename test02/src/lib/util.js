import Cookies from 'js-cookie'

const cookieExpires = 1

export const TOKEN_KEY = 'token'
export const USER_KEY = 'username'
export const REMARK_KEY = 'remark'

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

export const setUser = (name) => {
  Cookies.set(USER_KEY, name, { expires: cookieExpires || 1 })
}

export const getUser = () => {
  const username = Cookies.get(USER_KEY)
  if (username && username !== undefined) {
    return username
  } else {
    return false
  }
}

export const setRemark = (remark) => {
  Cookies.set(REMARK_KEY, remark, { expires: cookieExpires || 1 })
}

export const getRemark = () => {
  const remark = Cookies.get(REMARK_KEY)
  if (remark && remark !== undefined) {
    return remark
  } else {
    return false
  }
}