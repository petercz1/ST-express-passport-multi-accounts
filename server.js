var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');

app.set('view engine', 'ejs'); // set up ejs for html templating
app.use(express.static('public')); // fixed directory for css/js/images
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get json info
app.use(bodyParser.urlencoded({extended: true})); // get html forms info
app.use(session({secret: 'abc123'})); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session

require('./config/passports/passport')(passport); // passport for configuration
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./app/routes/main_routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

mongoose.connect(configDB.url, {
  useMongoClient: true
}); // connect to our database

app.listen(port, now_listening);

function now_listening() {
  console.log('The magic happens on port ' + port);
}