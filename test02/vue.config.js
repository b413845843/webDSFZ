const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: resolve('nodeServer/dist'),
  configureWebpack: config => {
    config.resolve = {
      extensions: ['.js', '.vue', '.json', '.css'],
      alias: {
        '@': resolve('src'),
        '_c': resolve('src/layout/iview/component')
      }
    }
  },
  devServer: {
    proxy: {
      '/dev': {
        target: 'http://localhost:80',
        changeOrigin: true,
        pathRewrite: {
          '^/dev': '/'
        }
      },
      'ding': {
        target: 'https://oapi.dingtalk.com',
        changeOrigin: true,
        pathRewrite: {
          '^/ding': '/'
        }
      }
    }
  },
  productionSourceMap: false
}