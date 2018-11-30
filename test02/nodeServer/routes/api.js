var express = require('express');
var router = express.Router();

router.get('/hello', (req, res, next) => {
  res.send('hello')
})

module.exports = router