import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/exam/swiper/list',
    method: 'get',
    params
  })
}
export function save(params) {
  return request({
    url: '/exam/swiper/save',
    method: 'post',
    data: params
  })
}
export function drop(param) {
  return request({
    url: '/exam/swiper/delete',
    method: 'post',
    data: param
  })
}
