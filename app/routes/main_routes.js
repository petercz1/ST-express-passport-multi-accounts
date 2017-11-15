module.exports = function (app, passport) {
  console.log('exporting routes');

  // ROUTES
  var local_auth_routes = require('./local_auth_routes');
  local_auth_routes(app, passport);

  var facebook_routes = require('./facebook_routes');
  facebook_routes(app, passport);

  var twitter_routes = require('./twitter_routes');
  twitter_routes(app, passport);

  var google_routes = require('./google_routes');
  google_routes(app, passport);

  var github_routes = require('./github_routes');
  github_routes(app, passport);

  var instagram_routes = require('./instagram_routes');
  instagram_routes(app, passport);

  // HOME PAGE (with login links)
  app.get('/', function (req, res) {
    console.log('getting index.ejs');
    res.render('pages/index.ejs'); // load the index.ejs file
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // PROFILE SECTION =====================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('pages/profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) // if user is authenticated in the session, carry on 
    return next();
  res.redirect('/'); // if they aren't redirect them to the home page  
}