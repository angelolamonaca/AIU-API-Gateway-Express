const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const httpProxy = require("express-http-proxy");
const axios = require("axios");

const app = express();
const authServiceProxy = httpProxy('auth-server:3020')
const walletServiceProxy = httpProxy('wallet-server:3030')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('/api/auth/*', (req, res, next) => {
    authServiceProxy(req, res, next)
})

app.all('/api/wallet/*', (req, res, next) => {
    walletServiceProxy(req, res, next)
})

app.use(async (req, res, next) => {
    const validateTokenUrl = 'http://auth-server:3020/api/auth/validatetoken'
    const config = {
        headers: {
            Authorization: req.headers.authorization
        }
    }
    axios.get(validateTokenUrl, config)
        .then(() => next())
        .catch(err => {
            console.log(err)
            next(createError(401))
        });
})

app.use('/api/users', usersRouter);
app.use('/', indexRouter);

module.exports = app;
