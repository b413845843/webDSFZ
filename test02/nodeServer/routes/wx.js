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
const productID = 51504
const deviceIDUrl = 'https://api.weixin.qq.com/device/getqrcode'
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

router.get('/deviceid', async (req, res, next) => {
  try {
    let res_access_token = await axios({
      method: 'get',
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx4943f6480a79a436&secret=13a6a97f36ad0badbbfcf5473875cb43'
    })
    console.log(res_access_token.data);

    if (res_access_token.data.access_token) {
      let access_token = res_access_token.data.access_token

      let res_deviceid = await axios({
        method: 'get',
        url: decodeURI,
        params: {
          access_token: access_token,
          product_id: productID
        }
      })
      console.log(res_deviceid.data);

      let message = JSON.stringify(res_deviceid.data)
      res.render('get_device_id', {
        title: `获取deviceid`,
        result: JSON.stringify(api_token) + '  ' + message
    })
    }
  } catch (err) {
    res.render('get_device_id', {
      title: '获取deviceid失败',
      result: JSON.stringify(err)
    })
  }
  console.log('end');
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
