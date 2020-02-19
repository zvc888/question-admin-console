import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const SSOTokenKey = 'sso.***.com'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  window.sessionStorage.setItem('token', token); // 上传文件token（ueditor从sessionStorage取）
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  if (getERPToken(SSOTokenKey)) {
    Cookies.remove(SSOTokenKey)
  }
  window.sessionStorage.removeItem('token')
  return Cookies.remove(TokenKey)
}

export function getERPToken() {
  return Cookies.get(SSOTokenKey)
}
