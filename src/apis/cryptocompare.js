import request from '@/utils/request'

export function OHLCV(params, resolution) {
  return request({
    url: `v2/${resolution}`,
    method: 'get',
    params,
  })
}
export function getOrderBook(params) {
  return request({
    url: 'v2/ob/l2/snapshot',
    method: 'get',
    params,
  })
}
export function fetchCoinList(params) {
  return request({
    url: 'v4/all/exchanges',
    method: 'get',
    params,
  })
}
export function fetchSymbolsFullData(params) {
  return request({
    url: 'pricemultifull',
    method: 'get',
    params,
  })
}
