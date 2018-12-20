var express = require('express');
var router = express.Router();
var userService = require('../services/userService')

const loggerFactory = require('../log/log4js')
const logger = loggerFactory.getLogger('login')
/* GET users listing. */
router.get('/getAllUsers', async function (req, res, next) {
  console.log('响应/getAllUsers');
  console.log(req.user);
  let result
  if (req.query.page && req.query.size) {
    console.log(`page and size ${req.query.page} ${req.query.size}`);
    result = await userService.getUsersByPage({ page: req.query.page, size: req.query.size })
  } else {
    result = await userService.getAllUsers()
  }

  if (!result.err) {
    res.send(result)
  } else {
    logger.info(result.err)
    res.status(400).send('服务器出错')
  }
});

router.get('/getUserInfo', async (req, res) => {
  console.log('响应/getUserInfo');
  console.log(req.user)
  let msg = await userService.getUserByname(req.user.name)
  console.log(`>>>>>>>>> ${msg.msg}`)
  let friends = await userService.getFriendsList(req.user.id)
  console.log(`${JSON.stringify(friends)}`)
  if (friends.length) {
    friends = friends.map(f => {
      return f.fid
    })
    friends = await userService.getUserByIds(friends)
    msg.friends = friends
  }
  res.json(msg)
})

router.post('/register', async function (req, res, next) {
  let username = req.body.username
  let password = req.body.password
  let mail = req.body.mail

  console.log(`${JSON.stringify(req.body)} 响应/register`);

  const msg = await userService.register(username, password, mail)
  console.log(msg);

  res.send(msg)
});

router.post('/update', async function (req, res, next) {
  let user = req.body

  console.log(`${JSON.stringify(req.body)} 响应/update`);

  const msg = await userService.update(user)
  console.log(msg);

  res.send(msg)
});

router.post('/delete', async function (req, res, next) {
  console.log(`${JSON.stringify(req.body)} 响应/delete`);
  let id = req.body
  if (req.user.remark !== '管理员') {
    console.log('没有权限,非法操作');
    res.json({ message: '没有权限', errcode: 4 })
  } else {
    const msg = await userService.deleteUserById(id)
    console.log(msg);

    res.send(msg)
  }
})

router.post('/makeFriend', async function (req, res, next) {
  console.log(`${JSON.stringify(req.body)} 响应/makeFriend`);
  let uid = req.body.uid
  let fid = req.body.fid
  const msg = await userService.makeFriend(uid, fid)
  console.log(msg);
  res.send(msg)
})

router.post('/deleteFriend', async function (req, res, next) {
  console.log(`${JSON.stringify(req.body)} 响应/deleteFriend`);
  let uid = req.body.uid
  let fid = req.body.fid
  const msg = await userService.deleteFriend(uid, fid)
  console.log(msg);
  res.send(msg)
})

router.post('/getFriendsList', async function (req, res, next) {
  console.log(`${JSON.stringify(req.body)} 响应/getFriend`);
  let uid = req.user.id
  const msg = await userService.getFriendsList(uid)
  console.log(msg);
  res.send(msg)
})

// 打印机
router.post('/addPrinter', (req, res) => {
  console.log(`${JSON.stringify(req.body)} 响应/addPrinter`);
  const printer = req.body
  userService.addPrinter(printer, (msg) => {
    res.send(msg)
  }, (msg) => {
    res.send(msg)
  })
})

router.get('/getAllPrinters', (req, res) => {
  console.log(`响应/getAllPrinters`);
  userService.getAllPrinters((msg) => {
    res.send(msg)
  }, (msg) => {
    res.send(msg)
  })
})

router.post('/deletePrinter', (req, res) => {
  console.log(`响应/getAllPrinters`);
  const printer = req.body
  userService.deletePrinter(printer, (msg) => {
    res.send(msg)
  }, (msg) => {
    res.send(msg)
  })
})
module.exports = router;
