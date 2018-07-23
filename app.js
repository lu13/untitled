var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const importRouter = require('./routes/import');
const ejs = require("ejs");

var app = express();

app.locals.title = "my title";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.route("/users").all(function (req,res,next) {
    console.info("route first");
    console.info(req.query.shoe);
    next();
});
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/import', importRouter);

app.param('id', function(req, res, next, id) {
    console.log('CALLED ONLY ONCE');
    if (id != "42") {
        res.send(403);
    }
    next();
});
app.get('/bbb/:id', function(req, res, next) {
    console.log('although this matches');
    next();
});
app.get('/bbb/:id', function(req, res) {
    console.log('and this mathces too');
    res.end();
});

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
