function github_passport(User, passport, configAuth) {
  var GithubStrategy = require('passport-github2').Strategy;

  var config = {
    // pull in our app id and secret from our auth.js file
    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL,
    //profileFields: configAuth.githubAuth.profileFields,
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  }

  passport.use(new GithubStrategy(config, github_response));

  // github will send back the token and profile
  function github_response(request, token, refreshToken, profile, done) {
    console.log(profile); // the secret trick to finding out what fields you can use
    if (!request.user) {
      // find the user in the database based on their github id
      User.findOne({
        'github.id': profile.id
      }, function (err, user) {
        if (err) return done(err); // error so stop
        if (user) {
          // if there is a user id already but no token (user was linked at one point and then removed) add our token and profile information
          if (!user.github.token) {
            registerUser(user, profile, token, done);
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
      var user = request.user; // pull the user out of the session
      registerUser(user, profile, token, done);
    }
  };
}

module.exports = github_passport;

function registerUser(user, profile, token, done) {
  // update the current users github credentials
  // console.log(profile) tells you what fields are available
  if (profile.id) {
    user.github.id = profile.id;
  }
  user.github.token = token;
  user.github.name = profile.username;
  user.github.email = profile.email;
  user.github.url = profile.profileUrl;
  user.save(function (err) {
    if (err)
      throw err;
    return done(null, user);
  });
}