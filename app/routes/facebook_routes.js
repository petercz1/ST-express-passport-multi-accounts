function facebook_routes(app, passport) {

  // FACEBOOK authenticate ie sign-in
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
  
  // FACEBOOK authorize ie ask permission to connect to other accounts
  app.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));

  // handle the callback after FACEBOOK has authenticated the user
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // handle the callback after FACEBOOK has said ok to link
  app.get('/connect/facebook/callback', passport.authorize('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // unlink FACEBOOK 
  app.get('/unlink/facebook', function (req, res) {
    var user = req.user;
    user.facebook.token = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
}

module.exports = facebook_routes;