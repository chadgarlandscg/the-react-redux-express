var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./src/routes/index');
var counter = require('./src/routes/counter');
var storedCounter = require('./src/routes/storedCounter');

var app = express();
var validate = require('express-validation');

// global Joi/express-validation config
validate.options({
    contextRequest: true, // allow access to path params
    allowUnknownBody: false // prevent unknown json in payloads,
})

app.set('views', __dirname + '/web/public/src');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../web/public')));

app.use('/counter', counter);
app.use('/storedCounter', storedCounter);

app.get('*', (req, res) => {
    res.sendFile('/web/public/index.html', {'root': __dirname + '/../'});
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err
    });
});

module.exports = app;
