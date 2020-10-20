const chromatic = require('chromatic-sass')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/apps/toolkit/'
    : '/',
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          functions: chromatic
        },
        prependData: `@import "~@/scss/styles.scss";`
      }
    }
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
 
    svgRule.uses.clear();
 
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  } ,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
        ws: true
      },
    },
  }, 
}