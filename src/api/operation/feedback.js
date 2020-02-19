import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/operation/feedback/list',
    method: 'get',
    params
  })
}

export function save(params) {
  return request({
    url: '/operation/feedback/save',
    method: 'post',
    data: params
  })
}
export function findById(id) {
  return request({
    url: '/operation/feedback/' + id,
    method: 'get'
    //   data: params
  })
}
export function drop(id) {
  return request({
    url: '/operation/feedback/' + id,
    method: 'delete'
  })
}
