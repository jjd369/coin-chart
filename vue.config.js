module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/common.scss";`,
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://min-api.cryptocompare.com/data',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
}
