function local_routes(app, passport) {

  var redirect_decision = {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  };

  // LOGIN - show the login form
  app.get('/login', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('pages/login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // LOGIN - process the login form
  app.post('/login', passport.authenticate('local-login', redirect_decision));

  // SIGNUP - show the signup form
  app.get('/signup', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('pages/signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // SIGNUP - process the signup form
  app.post('/signup', passport.authenticate('local-signup', redirect_decision));

  // link local account
  app.get('/connect/local', function (req, res) {
    res.render('pages/connect-local.ejs', {
      message: req.flash('loginMessage')
    });
  });
  app.post('/connect/local', passport.authenticate('local-signup', redirect_decision));

  // unlink local account
  app.get('/unlink/local', function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

}

module.exports = local_routes;