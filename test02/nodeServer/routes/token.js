var express = require('express');
var router = express.Router();
var userService = require('../services/userService')

router.post('/', async function(req, res, next) {
  let username = req.body.username
  let password = req.body.password
  console.log(`${JSON.stringify(req.body)} 响应/token`);

  const msg = await userService.login(username, password)
  res.send(msg)
})

module.exports = router;