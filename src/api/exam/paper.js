import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/exam/paper/list',
    method: 'get',
    params
  })
}
export function save(params) {
  return request({
    url: '/exam/paper/save',
    method: 'post',
    data: params
  })
}
export function findById(id) {
  return request({
    url: '/exam/paper/' + id,
    method: 'get'
    //   data: params
  })
}
export function getSubjectList() {
  return request({
    url: '/exam/paper/',
    method: 'get',
    // data: params
  })
}
export function drop(id) {
  return request({
    url: '/exam/paper/' + id,
    method: 'delete'
  })
}
