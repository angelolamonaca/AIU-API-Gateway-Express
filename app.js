const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const httpProxy = require("express-http-proxy");

const app = express();
const authServiceProxy = httpProxy('http://localhost:3020')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication

app.all('/api/auth/*', (req, res, next) => {
    authServiceProxy(req, res, next)
})

app.use((req, res, next) => {
    console.log(' OK')
    next()
})
app.use('/api/users', usersRouter);
app.use('/', indexRouter);

module.exports = app;
