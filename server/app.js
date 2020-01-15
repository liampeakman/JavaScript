var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require("cors");
const helmet = require('helmet');

var app = express();

// main 
var searchRouter = require('./routes/search');
var registerRouter = require('./routes/register');

// params
var offencesRouter = require('./routes/params/offences');
var agesRouter = require('./routes/params/ages');
var areasRouter = require('./routes/params/areas');
var yearsRouter = require('./routes/params/years');
var gendersRouter = require('./routes/params/genders');


//swagger
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json')
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// knex database
const options = require('./database/knex.js');
const knex = require('knex')(options);
app.use((req, res, next) => {
  req.db = knex
next() })

//cors
app.use(cors());

//helmet 
app.use(helmet());

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// main 
app.use(searchRouter); 
app.use(registerRouter); 

// params
app.use(offencesRouter);
app.use(agesRouter);
app.use(areasRouter);
app.use(yearsRouter);
app.use(gendersRouter);


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
