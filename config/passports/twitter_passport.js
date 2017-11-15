var TwitterStrategy = require('passport-twitter').Strategy;

function twitter_passport(User, passport, configAuth) {
  var config = {
    consumerKey: configAuth.twitterAuth.consumerKey,
    consumerSecret: configAuth.twitterAuth.consumerSecret,
    callbackURL: configAuth.twitterAuth.callbackURL,
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)      
  };

  passport.use(new TwitterStrategy(config, twitter_response));

  function twitter_response(req, token, tokenSecret, profile, done) {
    if (!req.user) {
      // find the user in the database based on their github id
      User.findOne({
        'twitter.id': profile.id
      }, function (err, user) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err) return done(err); // db error so stop
        if (user) {
          // if there is a user id already but no token (user was linked at one point and then removed) add our token and profile information
          if (!user.twitter.token) {
            registerUser(user);
          }
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that github id, create them
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
module.exports = twitter_passport;

function registerUser(user, profile, token, done) {
  // update the current users facebook credentials
  // console.log(profile) tells you what fields are available
  if (profile.id) {
    user.twitter.id = profile.id;
  }
  user.twitter.token = token;
  user.twitter.username = profile.username;
  user.twitter.displayName = profile.displayName;

  // save the user
  user.save(function (err) {
    if (err)
      throw err;
    return done(null, user);
  });
}
