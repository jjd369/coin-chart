import { OHLCV } from '@/apis/cryptocompare'

const history = {}

export default {
  history: history,

  getBars: function (symbolInfo, resolution, periodParams) {
    var split_symbol = symbolInfo.name.split(/[:/]/)
    const histo =
      resolution === 'D'
        ? 'histoday'
        : resolution >= 60
        ? 'histohour'
        : 'histominute'
    const params = {
      e: split_symbol[0],
      fsym: split_symbol[1],
      tsym: split_symbol[2],
      toTs: periodParams.to ? periodParams.to : '',
      limit: periodParams.countBack ? periodParams.countBack : 2000,
    }

    return OHLCV(params, histo)
      .then(({ data }) => {
        const { Data } = data
        console.log(Data)
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
        if (first) {
          var lastBar = bars[bars.length - 1]
          history[symbolInfo.name] = { lastBar: lastBar }
        }
        return bars
      })
      .catch((e) => {
        console.log(e)
      })
    // return rp({
    //   url: `${api_root}${url}`,
    //   qs,
    // }).then((data) => {
    //   console.log({ data })
    //   if (data.Response && data.Response === 'Error') {
    //     console.log('CryptoCompare API error:', data.Message)
    //     return []
    //   }
    //   if (data.Data.length) {
    //     console.log(
    //       `Actually returned: ${new Date(
    //         data.TimeFrom * 1000
    //       ).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`
    //     )
    //     var bars = data.Data.map((el) => {
    //       return {
    //         time: el.time * 1000, //TradingView requires bar time in ms
    //         low: el.low,
    //         high: el.high,
    //         open: el.open,
    //         close: el.close,
    //         volume: el.volumefrom,
    //       }
    //     })
    //     if (first) {
    //       var lastBar = bars[bars.length - 1]
    //       history[symbolInfo.name] = { lastBar: lastBar }
    //     }
    //     return bars
    //   } else {
    //     return []
    //   }
    // })
  },
}
