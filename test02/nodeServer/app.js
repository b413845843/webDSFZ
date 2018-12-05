var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');
var bodyParser = require('body-parser');

// var proxy = require('http-proxy-middleware')

// 路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api')
var wxRouter = require('./routes/wx')

// 配置
var config = require('./config/jwt_config')

var app = express();

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 设置全局变量 jwtsecret
app.set('jwtsecret', config.jwtsecret)

// app.use('/api', proxy({ target: 'localhost', changeOrigin: true }))
// 默认
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

// app.use(jwt({ secret: Buffer.from(config.jwtsecret, 'base64') }).unless({ path: ['/login'] }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/wx', wxRouter)

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
