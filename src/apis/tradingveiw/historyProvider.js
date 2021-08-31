import { OHLCV } from '@/apis/cryptocompare'

const history = {}

export default {
  history: history,

  getBars: function (symbolInfo, resolution, periodParams) {
    console.log(resolution)
    var split_symbol = symbolInfo.name.split(/[:/]/)
    console.log(split_symbol)
    const histo =
      resolution === 'D'
        ? 'histoday'
        : resolution >= 60
        ? 'histohour'
        : 'histominute'

    const params = {
      // e: split_symbol[0],
      fsym: split_symbol[0],
      tsym: split_symbol[1],

      toTs: periodParams.to ? periodParams.to : '',
      limit: periodParams.countBack < 2000 ? periodParams.countBack : 2000,
    }

    return OHLCV(params, histo)
      .then(({ data }) => {
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
        if (periodParams.firstDataRequest) {
          var lastBar = bars[bars.length - 1]
          history[symbolInfo.name] = { lastBar: lastBar }
        }
        return bars
      })
      .catch((e) => {
        console.log(e)
      })
  },
}
