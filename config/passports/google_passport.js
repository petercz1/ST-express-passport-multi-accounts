var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = google_passport;

function google_passport(User, passport, configAuth) {
  var config = {
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  };

  passport.use(new GoogleStrategy(config, google_response));

  // google will send back the token and profile
  function google_response(request, token, refreshToken, profile, done) {
    console.log(profile); // the secret trick to finding out what fields you can use    
    if (!request.user) {
      // find the user in the database based on their google id
      User.findOne({
        'google.id': profile.id
      }, function (err, user) {
        if (err) return done(err); // db error so stop
        if (user) {
          // if there is a user id already but no token (user was linked at one point and then removed) add our token and profile information
          if (!user.google.token) {
            registerUser(user, profile, token, done);
          }
          return done(null, user); // user found, return that user
        } else {
          // if the user isnt in our database, create a new user
          var newUser = new User();
          registerUser(newUser, profile, token, done);
        }
      });
    } else {
      // user already exists and is logged in, we have to link accounts
      var user = request.user; // pull the user out of the session
      registerUser(user, profile, token, done);
    }
    // });
  };
}

function registerUser(user, profile, token, done) {
  // update the current users facebook credentials
  // console.log(profile) tells you what fields are available
  if (profile.id) {
    user.google.id = profile.id;
  }
  user.google.token = token;
  user.google.name = profile.displayName;
  user.google.email = profile.emails[0].value;

  // save the user
  user.save(function (err) {
    if (err)
      throw err;
    return done(null, user);
  });
}