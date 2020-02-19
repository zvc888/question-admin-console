import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/exam/question/list',
    method: 'get',
    params
  })
}
export function save(params) {
  return request({
    url: '/exam/question/save',
    method: 'post',
    data: params
  })
}
export function findById(id) {
  return request({
    url: '/exam/question/' + id,
    method: 'get'
    //   data: params
  })
}

export function drop(id) {
  return request({
    url: '/exam/question/' + id,
    method: 'delete'
  })
}
