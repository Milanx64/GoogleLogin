var express = require('express');
var app = express();
var port = 3000;
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var confingDB = require('./confing/database.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/GoogleSingin');

var bodyParser=require('body-parser'); 

var User = require('./app/models/user');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.urlencoded({ extended: false }));

var configDB = require('./confing/database.js');

require('./confing/passport')(passport);
//midelwere
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({secret: 'anystringoftxt',
saveUninitialized: true,
resave: true}));
/*app.use('/', function(req, res){
  res.send("Hello World" );
});*/
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./app/routes.js')(app, passport);
app.set('view engine', 'ejs');
app.listen(port);
console.log('Server runing on port '+ port);