import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/exam/subject/list',
    method: 'get',
    params
  })
}
export function save(params) {
  return request({
    url: '/exam/subject/save',
    method: 'post',
    data: params
  })
}
export function findById(id) {
  return request({
    url: '/exam/subject/' + id,
    method: 'get'
    //   data: params
  })
}
export function getSubjectList() {
  return request({
    url: '/exam/subject/',
    method: 'get',
    // data: params
  })
}
export function getSubjectListByCategoryId(params) {
  return request({
    url: '/exam/subject/?categoryId=' + params.categoryId,
    method: 'get',
    // data: params
  })
}
export function drop(id) {
  return request({
    url: '/exam/subject/' + id,
    method: 'delete'
  })
}
