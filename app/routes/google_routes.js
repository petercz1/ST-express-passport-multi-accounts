function google_routes(app, passport) {

  // GOOGLE authenticate ie sign-in
  app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

  // GOOGLE authorize ie ask permission to connect FB account to other accounts
  app.get('/connect/google', passport.authorize('google', {scope: ['profile', 'email']}));

  // handle the callback after GOOGLE has authenticated the user
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // handle the callback after GOOGLE has said ok to link
  app.get('/connect/google/callback', passport.authorize('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // unlink GOOGLE
  app.get('/unlink/google', function (req, res) {
    var user = req.user;
    user.google.token = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
}

module.exports = google_routes;