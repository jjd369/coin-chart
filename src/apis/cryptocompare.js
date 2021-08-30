import request from '@/utils/request'

export function OHLCV(params, resolution) {
  return request({
    url: `v2/${resolution}`,
    method: 'get',
    params,
  })
}

export function getHistoday(params) {
  return request({
    url: 'v2/histoday',
    method: 'get',
    params,
  })
}

export function getHistohour(params) {
  return request({
    url: 'v2/histohour',
    method: 'get',
    params,
  })
}

export function getHistominute(params) {
  return request({
    url: 'v2/histominute',
    method: 'get',
    params,
  })
}
