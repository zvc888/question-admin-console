import request from '@/utils/request'

export function getLis(params) {
  return request({
    url: '/sysmgr/notice/list',
    method: 'get',
    params
  })
}
export function getCount(params) {
  return request({
    url: '/sysmgr/notice/count',
    method: 'get',
    params
  })
}
