import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/exam/category/list',
    method: 'get',
    params
  })
}
export function getAllList() {
  return request({
    url: '/exam/category/',
    method: 'get'
  })
}

export function save(params) {
  return request({
    url: '/exam/category/save',
    method: 'post',
    data: params
  })
}
export function findById(id) {
  return request({
    url: '/exam/category/' + id,
    method: 'get'
    //   data: params
  })
}
export function drop(id) {
  return request({
    url: '/exam/category/' + id,
    method: 'delete'
  })
}
