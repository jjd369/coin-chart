import { OHLCV } from '@/apis/cryptocompare'

const history = {}

export default {
  history: history,

  getBars: function (symbolInfo, resolution, periodParams) {
    const { countBack, firstDataRequest, to } = periodParams
    var split_symbol = symbolInfo.name.split(/[:/]/)

    const histo =
      resolution === 'D'
        ? 'histoday'
        : resolution >= 60
        ? 'histohour'
        : 'histominute'

    const params = {
      fsym: split_symbol[0],
      tsym: split_symbol[1],
      toTs: to || '',
      limit: countBack < 2000 ? countBack : 2000,
      e: 'Binance',
    }

    return OHLCV(params, histo).then(({ data }) => {
      const { Data } = data

      if (!Data.Data.length) return []

      var bars = Data.Data.map((el) => {
        return {
          time: el.time * 1000, //TradingView requires bar time in ms
          low: el.low,
          high: el.high,
          open: el.open,
          close: el.close,
          volume: el.volumefrom,
        }
      })

      if (firstDataRequest) {
        var lastBar = bars[bars.length - 1]
        history[symbolInfo.name] = { lastBar: lastBar }
      }
      return bars
    })
  },
}
