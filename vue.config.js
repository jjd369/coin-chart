const path = require('path')

module.exports = {
  outputDir: 'docs',
  publicPath: '/coin-chart',
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/common.scss";`,
      },
    },
  },
}
