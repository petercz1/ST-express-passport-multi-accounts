function github_routes(app, passport) {

  // GITHUB authenticate ie sign-in
  app.get('/auth/github', passport.authenticate('github', {scope: ['user:email']}));
  
  // GITHUB authorize ie ask permission to connect to other accounts
  app.get('/connect/github', passport.authorize('github', {scope: ['user:email']}));

  // handle the callback after GITHUB has authenticated the user
  app.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // handle the callback after GITHUB has said ok to link
  app.get('/connect/github/callback', passport.authorize('github', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  // unlink GITHUB 
  app.get('/unlink/github', function (req, res) {
    var user = req.user;
    user.github.token = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
}

module.exports = github_routes;