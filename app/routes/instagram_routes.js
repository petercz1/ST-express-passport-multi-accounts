function instagram_routes(app, passport) {

  // INSTAGRAM authenticate ie sign-in
  app.get('/auth/instagram', passport.authenticate('instagram'));
  // INSTAGRAM authorize ie ask permission to connect to other accounts
  
  app.get('/connect/instagram', passport.authorize('instagram'));

  // handle the callback after INSTAGRAM has authenticated the user
  app.get('/auth/instagram/callback', passport.authenticate('instagram', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // handle the callback after INSTAGRAM has said ok to link
  app.get('/connect/instagram/callback', passport.authorize('instagram', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // unlink INSTAGRAM 
  app.get('/unlink/instagram', function (req, res) {
    var user = req.user;
    user.instagram.token = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
}

module.exports = instagram_routes;