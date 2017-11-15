var LocalStrategy = require('passport-local').Strategy;

function local_passport(User, passport) {
  var config = {
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  };

  passport.use('local-signup', new LocalStrategy(config, local_signup_response));

  function local_signup_response(req, email, password, done) {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({
      'local.email': email
    }, function (err, user) {
      if (err) return done(err); // stop - db error
      // check to see if theres already a user with that email
      if (user) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {
        // if there is no user with that email then create the user
        var newUser = new User();
        save_new_user(email, newUser, password, done);
      }
    });
  };

  var local_login_details = {
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  };

  passport.use('local-login', new LocalStrategy(local_login_details, local_login_response));

  function local_login_response(req, email, password, done) { // callback with email and password from our form
    console.log('inside local login strategy');
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({
      'local.email': email
    }, function (err, user) {
      // if there are any errors, return the error before anything else
      if (err) return done(err); // stop - db error
      // if no user is found, return the message
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
      // if the user is found but the password is wrong
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
      // all is well, return successful user
      return done(null, user);
    });
  };
}

module.exports = local_passport;

function save_new_user(email, newUser, password, done) {
  // set the user's local credentials
  newUser.local.email = email;
  newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model

  // save the user
  newUser.save(function (err) {
    if (err)
      throw err;
    return done(null, newUser);
  });
}