const path = require('path');

module.exports = {
    outputDir: 'docs',
    publicPath: '/coin-chart',
    css: {
        loaderOptions: {
            sass: {
                additionalData: `@import "@/assets/scss/common.scss";`
            }
        }
    }
}
