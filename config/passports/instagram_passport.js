function instagram_passport(User, passport, configAuth) {
  var instagramStrategy = require('passport-instagram').Strategy;

  var config = {
    // pull in our app id and secret from our auth.js file
    clientID: configAuth.instagramAuth.clientID,
    clientSecret: configAuth.instagramAuth.clientSecret,
    callbackURL: configAuth.instagramAuth.callbackURL,
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  }

  passport.use(new instagramStrategy(config, instagram_response));

  // instagram will send back the token and profile
  function instagram_response(req, token, refreshToken, profile, done) {
    console.log(profile); // the secret trick to finding out what fields you can use
    if (!req.user) {
      // find the user in the database based on their instagram id
      User.findOne({
        'instagram.id': profile.id
      }, function (err, user) {
        if (err) return done(err); // db error so stop
        if (user) {
          console.log(user);
          // if there is a user id already but no token (user was linked at one point and then removed) add our token and profile information
          if (!user.instagram.token) {
            registerUser(user, profile, token, done);
          }
          //return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that instagram id, create them
          var newUser = new User();
          registerUser(newUser, profile, token, done);
        }
      });
    } else {
      // user already exists and is logged in, we have to link accounts
      var user = req.user; // pull the user out of the session
      registerUser(user, profile, token, done);
    }
  };
}

module.exports = instagram_passport;

function registerUser(user, profile, token, done) {
  // update the current users instagram credentials
  // console.log(profile) tells you what fields are available
  if (profile.id) {
    user.instagram.id = profile.id;
  }
  user.instagram.token = token;
  user.instagram.username = profile.username;
  user.instagram.displayName = profile.displayName;
  user.save(function (err) {
    if (err)
      throw err;
    return done(null, user);
  });
}