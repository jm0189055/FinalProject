'use strict';

let express = require('express');
let passport = require('passport');
let Strategy = require('passport-facebook').Strategy;



passport.use(new Strategy({
    clientID: 323551068232636,
    clientSecret: '2e4bf98c9cc143e4b00cab6a95e2de9b',
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});


let app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'topsecretpasscode', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
    console.log("inside return route..");
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    console.log("inside profile route..");
    res.render('profile', { user: req.user });
  });

app.listen(3000, function(){
    console.log('App listening on port 3000');
});
