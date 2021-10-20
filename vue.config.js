module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/variables.scss";`,
      },
    },
  },
  // 프록시 서버 설정
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://min-api.cryptocompare.com/data',
  //       changeOrigin: true,
  //       pathRewrite: { '^/api': '' },
  //     },
  //   },
  //   headers: { 'Access-Control-Allow-Origin': '*' },
  // },
}
