var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');
var bodyParser = require('body-parser');
// var jwt = require('jsonwebtoken')
var e_jwt = require('express-jwt')
// var proxy = require('http-proxy-middleware')

// 路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api')
var wxRouter = require('./routes/wx')
var tokenRouter = require('./routes/token')

// 配置
var config = require('./config/jwt_config')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// 中间件
// 配合vue的history模式
app.use(history({
  rewrites: [{
      from: /^\/wx\/.*$/,
      to: function (context) {
        return context.parsedUrl.pathname;
      }
    },
    {
      from: /^\/users\/.*$/,
      to: function (context) {
        return context.parsedUrl.pathname;
      }
    }
  ]
}));

app.use('/users', e_jwt({ secret: config.jwtsecret,
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'token') {
      var token = req.headers.authorization.split(' ')[1];
      console.log(`check token ${token}`)
      return token
    } else {
      return null
    }
  }
}).unless({ path: ['/token', '/users/register'] }));

app.use('/', indexRouter);
app.use('/token', tokenRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/wx', wxRouter)

// JWT 手动验证
// app.use('/users', (req, res, next) => {
//   // 拿取token 数据 按照自己传递方式写
//   var token
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'token') {
//     console.log(`check token :${req.headers.authorization.split(' ')[1]}`);
//     token = req.headers.authorization.split(' ')[1];
//   }
//   console.log(`token ${token}`);
//   if (token) {
//   // 解码 token (验证 secret 和检查有效期（exp）)
//     jwt.verify(token, config.jwtsecret, function(err, decoded) {
//       if (err) {
//         return res.json({ success: false, message: '无效的token.' })
//       } else {
//         // 如果验证通过，在req中写入解密结果
//         req.user = decoded;
//         next();
//       }
//       });
//   } else {
//     // 没有拿到token 返回错误
//     return res.status(403).send({
//       success: false,
//       message: '没有找到token.'
//     });
//   }
// })

// app.use('/api', proxy({ target: 'localhost', changeOrigin: true }))
// 默认

// app.use(e_jwt({ secret: config.jwtsecret }));

//  设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //  Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('token 无效');
  } else {
    // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  }
});

module.exports = app;
