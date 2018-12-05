let express = require('express')
let fs = require('fs')
var readline = require('readline');
let path = require('path')
let sha1 = require('sha1')
let router = express.Router()
let axios = require('axios')

const loggerFactory = require('../log/log4js')
const wxLogger = loggerFactory.getLogger('wx')
const logPath = path.join(__dirname, '../log/logs/wx_file.log')

const token = 'dascom666'
const productID = 51054
const deviceIDUrl = 'https://api.weixin.qq.com/device/getqrcode'
const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx4943f6480a79a436&secret=13a6a97f36ad0badbbfcf5473875cb43'
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

  let echostr = req.query.echostr;
  let signature = req.query.signature;
  let timestamp = req.query.timestamp;
  let nonce = req.query.nonce;

  let oriArray = [];
  oriArray.push(nonce);
  oriArray.push(timestamp);
  oriArray.push(token);

  let original = oriArray.sort().join('');
  let combineStr = sha1(original);

  if (signature === combineStr) {
    res.send(echostr);
    wxLogger.info(`验证成功`)
  } else {
    wxLogger.info(`验证失败`)

    res.render('wx_vaild', {
      content: `验证失败:${JSON.stringify(req.query)}`
    })
  }
})

router.get('/token', async (req, res, next) => {
  try {
    let api = await axios({
      method: 'get',
      url: tokenUrl
    })
    wxLogger.info(`获取access_token:${JSON.stringify(api.data)}`);
    access_token = api.data.access_token

    if (access_token) {
      res.render('get_device_id', {
        title: `获取access_token 成功`,
        result: access_token
      })
    } else {
      res.render('get_device_id', {
        title: `获取access_token 失败`,
        result: JSON.stringify(api.data)
      })
    }
  } catch (err) {
    res.render('get_device_id', {
      title: '获取access_token失败',
      result: JSON.stringify(err)
    })
  }
})

router.get('/deviceid', async (req, res, next) => {
  try {
    let result = await axios({
      method: 'get',
      url: deviceIDUrl,
      params: {
        access_token: access_token,
        product_id: productID
      }
    })
    wxLogger.info(`获取deviceid:${JSON.stringify(result.data)}`);
    const devID = result.data.deviceid

    if (devID) {
      res.render('get_device_id', {
        title: `获取deviceid成功`,
        result: devID
      })
    } else {
      res.render('get_device_id', {
        title: `获取deviceid失败`,
        result: JSON.stringify(result.data)
      })
    }

  } catch (err) {
    res.render('get_device_id', {
      title: '获取deviceid失败',
      result: JSON.stringify(err)
    })
  }
})

// 读取log页面
router.get('/readLog', (req, res, next) => {
  console.log(logPath);
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
