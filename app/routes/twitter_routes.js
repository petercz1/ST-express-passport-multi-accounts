function twitter_routes(app, passport) {

  // TWITTER authenticate ie sign-in
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // TWITTER authorize ie ask permission to connect to other accounts
  app.get('/connect/twitter', passport.authorize('twitter'));

  // handle the callback after TWITTER has authenticated the user
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // handle the callback after TWITTER has said ok to link
  app.get('/connect/twitter/callback', passport.authorize('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // unlink TWITTER 
  app.get('/unlink/twitter', function (req, res) {
    var user = req.user;
    user.twitter.token = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
}

module.exports = twitter_routes;