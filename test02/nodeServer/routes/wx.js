let express = require('express')
let router = express.Router()

const loggerFactory = require('../log/log4js')

const wxLogger = loggerFactory.getLogger('wx')

router.get('/', (req, res, next) => {
  console.log('cuck');
  wxLogger.info(`收到了请求 : ${JSON.stringify(req.body)}`)
  res.json({
    message: `收到啦~~~干嘛呢`,
    request: JSON.stringify(req.body)
  })
})

module.exports = router