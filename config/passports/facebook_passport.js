function facebook_passport(User, passport, configAuth) {
  var FacebookStrategy = require('passport-facebook').Strategy;

  var config = {
    // pull in our app id and secret from our auth.js file
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: configAuth.facebookAuth.profileFields,
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  }

  passport.use(new FacebookStrategy(config, facebook_response));

  // facebook will send back the token and profile
  function facebook_response(request, token, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log(profile); // the secret trick to finding out what fields you can use
      // asynchronous
      if (!request.user) {
        // find the user in the database based on their facebook id
        User.findOne({
          'facebook.id': profile.id
        }, function (err, user) {
          if (err) return done(err); // db error so stop
          if (user) {
            // if there is a user id already but no token (user was linked at one point and then removed) add our token and profile information
            if (!user.facebook.token) {
              registerUser(user, profile, token, done);
            }
            //return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
            registerUser(newUser, profile, token, done);
          }
        });
      } else {
        // user already exists and is logged in, we have to link accounts
        var user = request.user; // pull the user out of the session
        registerUser(user, profile, token, done);
      }
    });
  };

}

module.exports = facebook_passport;

function registerUser(user, profile, token, done) {
  console.log('registering user details');
  // update the current users facebook credentials
  // console.log(profile) tells you what fields are available
  if (profile.id) {
    user.facebook.id = profile.id;
  }
  user.facebook.token = token;
  user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
  user.facebook.email = profile.emails[0].value;
  user.save(function (err) {
    console.log('saving user details');
    if (err)
      throw err;
    return done(null, user);
  });
}