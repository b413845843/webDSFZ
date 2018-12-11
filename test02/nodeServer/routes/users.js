var express = require('express');
var router = express.Router();
var userService = require('../services/userService')

const loggerFactory = require('../log/log4js')
const logger = loggerFactory.getLogger('login')
  /* GET users listing. */
router.get('/getAllUsers', async function(req, res, next) {
  console.log('响应/getAllUsers');
  console.log(req.user);
  
  const result = await userService.getAllUsers()
  if (!result.err) {
    res.send(result)
  } else {
    logger.info(result.err)
    res.status(400).send('服务器出错')
  }
});

router.post('/register', async function(req, res, next) {
  let username = req.body.username
  let password = req.body.password
  let mail = req.body.mail

  console.log(`${JSON.stringify(req.body)} 响应/register`);

  const msg = await userService.register(username, password, mail)
  console.log(msg);

  res.send(msg)
});

router.post('/update', async function(req, res, next) {
  let user = req.body

  console.log(`${JSON.stringify(req.body)} 响应/update`);

  const msg = await userService.update(user)
  console.log(msg);

  res.send(msg)
});

router.post('/delete', async function(req, res, next) {
  let id = req.body

  console.log(`${JSON.stringify(req.body)} 响应/delete`);

  const msg = await userService.deleteUserById(id)
  console.log(msg);

  res.send(msg)
})
module.exports = router;