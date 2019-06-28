const createError = require('http-errors');
const express = require('express');
require('./services/cloudinary-setup');
require('./services/passport-setup');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport=require('passport');

const indexRouter = require('./routes/index');
const authRoutes=  require('./routes/auth-routes');
const usersRouter = require('./routes/users');
const buzzRoutes=require('./routes/buzzes');
const complaintsRoutes=require('./routes/complaints');

const mongoConnection=require('./connection');
const cors=require('cors');

const app = express();
mongoConnection.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth',authRoutes);
app.use('/buzzes',buzzRoutes);
app.use('/complaints',complaintsRoutes);
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
    res.render('error.ejs');
});
module.exports = app;