var express = require('express');
var router = express.Router();
var userService = require('../database/userService')
  /* GET users listing. */
router.get('/getAllUsers', function(req, res, next) {
  console.log('响应/getAllUsers');
  const users = userService.getAllUser()
  res.send(users)
});

router.post('/login', async function(req, res, next) {
  let username = req.body.username
  let password = req.body.password
  console.log(`${JSON.stringify(req.body)} 响应/login`);

  const msg = await userService.login(username, password)
  res.send(msg)
})

router.post('/register', async function(req, res, next) {
  let username = req.body.username
  let password = req.body.password
  let mail = req.body.mail

  console.log(`${JSON.stringify(req.body)} 响应/register`);

  const msg = await userService.register(username, password, mail)
  console.log(msg);

  res.send(msg)
});

module.exports = router;