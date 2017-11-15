//var config = {config stuff};

passport.use(new FacebookStrategy(config, facebook_response));

// facebook will send back the token and profile
function facebook_response(request, token, refreshToken, profile, done) {
  console.log(profile); // the secret trick to finding out what fields you can use
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
        return done(null, user); // user found, return that user
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
};

function registerUser(ser, profile, token, done) {
    // register user stuff
}