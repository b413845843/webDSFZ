var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');
var bodyParser = require('body-parser');
var proxy = require('http-proxy-middleware')
// var jwt = require('jsonwebtoken')
var e_jwt = require('express-jwt')
var cors = require('cors')
    // 路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api')
var wxRouter = require('./routes/wx')
var tokenRouter = require('./routes/token')
var pdfRouter = require('./routes/pdf')

// 配置
var config = require('./config/jwt_config')

// 频率限制
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});

var app = express();

app.set('jwt_secret', config.jwtsecret)
    // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var options = {
  target: 'https://oapi.dingtalk.com',
  changeOrigin: true,
  pathRewrite: {
    '^/ding': '/'
  }
}

// create the proxy (without context)
var dingProxy = proxy(options)
app.use('/ding', dingProxy)

app.use(cors())

app.use(history({
  rewrites: [{
          from: /^\/wx\/.*$/,
          to: function(context) {
              return context.parsedUrl.pathname;
          }
      },
      {
          from: /^\/users\/.*$/,
          to: function(context) {
              return context.parsedUrl.pathname;
          }
      }
  ]
}));

app.use('/wx/', apiLimiter);
app.use('/token/', apiLimiter);
app.use('/users/', apiLimiter);
// 中间件
app.use('/users', e_jwt({
    secret: config.jwtsecret,
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'token') {
            var token = req.headers.authorization.split(' ')[1];
            console.log(`check token ${token}`)
            return token
        } else {
            return null
        }
    }
}).unless({ path: ['/token', '/users/register', '/ding'] }));

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', indexRouter);
app.use('/token', tokenRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/wx', wxRouter)
app.use('/pdf', pdfRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
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