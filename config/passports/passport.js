
// load up the user model
var User = require('../../app/models/user');

// load the auth variables
var configAuth = require('../auth');

// expose this function to our app using module.exports
module.exports = function (passport) {

  var serializer = require('./serializer');
  serializer(User, passport);

  var local_passport = require('./local_passport');
  local_passport(User, passport); // doesn't use configAuth

  var facebook_passport = require('./facebook_passport');
  facebook_passport(User, passport, configAuth);

  var twitter_passport = require('./twitter_passport');
  twitter_passport(User, passport, configAuth);

  var google_passport = require('./google_passport');
  google_passport(User, passport, configAuth);

  var github_passport = require('./github_passport');
  github_passport(User, passport, configAuth);

  var instagram_passport = require('./instagram_passport');
  instagram_passport(User, passport, configAuth)

};