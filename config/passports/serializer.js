function serializer(User, passport) {

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = serializer;

// this turns object into strings to pass over the network
// then back into objects.
// same as JSON.parse/JSON.stringify on front end
// json_encode(...)/json_decode(...) in php