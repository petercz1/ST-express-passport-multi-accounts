// expose our config directly to our application using module.exports
module.exports = {

  'facebookAuth': {
    'clientID': '', // your App ID
    'clientSecret': '', // your App Secret
    'callbackURL': 'http://localhost:8080/auth/facebook/callback',
    'profileFields': ["email", "displayName", "name", "photos"]
  },
  'twitterAuth': {
    'consumerKey': '',
    'consumerSecret': '',
    'callbackURL': 'http://localhost:8080/auth/twitter/callback'
  },
  'googleAuth': {
    'clientID': '',
    'clientSecret': '',
    'callbackURL': 'http://localhost:8080/auth/google/callback'
  },
  'githubAuth': {
    'clientID': '',
    'clientSecret': '',
    'callbackURL': 'http://localhost:8080/auth/github/callback'
  },
  'instagramAuth': {
    'clientID': '',
    'clientSecret': '',
    'callbackURL': 'http://localhost:8080/auth/instagram/callback'
  }
  
};