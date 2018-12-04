var log4js = require('log4js')
var path = require('path')

var logPath = path.resolve(__dirname, 'logs/login_file.log')
var wxPath = path.resolve(__dirname, 'logs/wx_file.log')
console.log(`log_path : ${logPath}`);

log4js.configure({
  replaceConsolse: true,
  appenders: {
    out: {
      type: 'console',
      category: 'console'
    },
    login_file: {
      type: 'file',
      filename: logPath, // 文件目录，当目录文件或文件夹不存在时，会自动创建
      maxLogSize: 1024 * 4, // 文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
      backups: 3, // default value = 5.当文件内容超过文件存储空间时，备份文件的数量
      // compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
      encoding: 'utf-8', // default "utf-8"，文件的编码
      category: 'log_file'
    },
    wx_file: {
      type: 'file',
      filename: wxPath, // 文件目录，当目录文件或文件夹不存在时，会自动创建
      maxLogSize: 1024 * 4, // 文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
      backups: 3, // default value = 5.当文件内容超过文件存储空间时，备份文件的数量
      // compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
      encoding: 'utf-8', // default "utf-8"，文件的编码
      category: 'wx_file'
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    login: { appenders: ['login_file', 'out'], level: 'info' },
    wx: { appenders: ['wx_file', 'out'], level: 'info' }
  }
})

module.exports = log4js
