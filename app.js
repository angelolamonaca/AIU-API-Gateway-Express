const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const httpProxy = require('express-http-proxy')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const authServiceProxy = httpProxy('http://localhost:3020')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  authServiceProxy(req, res, next)
  next(createError(401));
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
