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
        target: 'http://localhost:8099',
        changeOrigin: true,
        pathRewrite: {
          '^/dev': '/'
        }
      }
    }
  }
}