var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard-admin');
var dashboardShopOwnerRouter = require('./routes/dashboard-shop-owner');
var bodyParser = require('body-parser')
var usersapi=require('./api/user');
var shopsapi=require('./api/get-catering-shops');
var ordersapi=require('./api/order');
// var viewAllShops = require('./routes/shops');
var usersRouter = require('./routes/users');
const { error } = require('console');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('etag');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended:false }))

// parse application/json
app.use(bodyParser.json())
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use( express.static( "public" ) );
app.use(express.static(path.join(__dirname + 'public')));
app.use('/', indexRouter);
app.use('/dashboard-admin', dashboardRouter);
app.use('/users', usersRouter);
app.use('/dashboard-shop-owner', dashboardShopOwnerRouter);
app.use('/uapi',usersapi);
app.use('/shopsapi',shopsapi);
app.use('/ordersapi',ordersapi);
// app.use('/dashboard-admin/shops',shopsRouter);
// app.use(function(req,res,next){
//   req.connection.setNoDelay(true);
//   next();
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
 res.render('error');
});
module.exports = app;
