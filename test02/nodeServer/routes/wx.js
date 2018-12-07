let express = require('express')
let fs = require('fs')
var readline = require('readline');
let path = require('path')
let router = express.Router()
let wxService = require('../services/wxService')

const loggerFactory = require('../log/log4js')
const wxLogger = loggerFactory.getLogger('wx')
const logPath = path.join(__dirname, '../log/logs/wx_file.log')

// 按行读取log文件
function readFileToArr(fReadName, callback) {
  var fRead = fs.createReadStream(fReadName);
  var objReadline = readline.createInterface({
    input: fRead
  });
  var arr = [];
  objReadline.on('line', function (line) {
    arr.push(line);
    // console.log('line:'+ line);
  });
  objReadline.on('close', function () {
    // console.log(arr);
    callback(arr);
  });
}

// 微信平台校验
router.get('/', (req, res, next) => {
  wxLogger.info(`服务器回调 GET: ${JSON.stringify(req.query)}`)

  let result = wxService.verify(req, res, next)

  if (result.res) {
    res.send(result.echostr);
    wxLogger.info(`验证成功`)
  } else {
    wxLogger.info(`验证失败`)
    res.render('wx_vaild', {
      content: `验证失败:${req.query}`
    })
  }
})

router.get('/token', async (req, res, next) => {
  let result = await wxService.token(req, res, next)
  wxLogger.info(`获取access_token ${result}`);
  res.render('get_device_id', {
    title: `获取access_token`,
    result: result.access_token || result
  })
})

router.get('/deviceid', async (req, res, next) => {
    let result = await wxService.deviceID(req, res, next)
    const devID = result.deviceid
    wxLogger.info(`获取deviceid:${result}`);
    res.render('get_device_id', {
      title: `获取deviceid`,
      result: devID || result
    })
})

// 读取log页面
router.get('/readLog', (req, res, next) => {
  console.log(`收到了请求 readLog: ${JSON.stringify(req.query)}`)
  fs.readFile(logPath, {
    encoding: 'utf8'
  }, (err, data) => {
    if (err) {
      // console.log(`读取错误 ${JSON.stringify(err)}`)
      res.send(JSON.stringify(err))
    } else {
      console.log(`读取: ${data.toString()}`)
      readFileToArr(logPath, (arr) => {
        res.render('wx_log', {
          content: data.toString(),
          lines: arr
        })
      })
    }
  })
})

module.exports = router
