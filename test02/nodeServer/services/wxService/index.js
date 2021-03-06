let axios = require('axios')
let sha1 = require('sha1')

let access_token = null
const token = 'dascom666'
const productID = 51397
const deviceIDUrl = 'https://api.weixin.qq.com/device/getqrcode'
const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx7e8e5f8aa344fb60&secret=bdffa3f89b8042d1de240b91f17ddf59'

module.exports = {
  verify(req, res, next) {
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

    return { res: combineStr === signature, echostr: echostr }
  },
  async token(res, req, next) {
    try {
      let result = await axios({
        method: 'get',
        url: tokenUrl
      })
      access_token = result.data.access_token

      if (access_token) {
        return { access_token }
      } else {
        console.log(JSON.stringify(result.data));
        return JSON.stringify(result.data) + ' <-> ' + tokenUrl
      }
    } catch (err) {
      return new Error('获取access_token 失败' + JSON.stringify(err) + tokenUrl)
    }
  },
  async deviceID(res, req, next) {
    try {
      let result = await axios({
        method: 'get',
        url: deviceIDUrl,
        params: {
          access_token: access_token,
          product_id: productID
        }
      })
      const data = result.data
      if (data) {
        return { data }
      } else {
        return JSON.stringify(result.data) + deviceIDUrl
      }
    } catch (err) {
      return { err: new Error('获取获取deviceID 失败' + JSON.stringify(err) + deviceIDUrl) }
    }
  }
}
