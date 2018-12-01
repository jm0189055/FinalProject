'use strict';

let express = require('express'),
  passport = require('passport'),
  Strategy = require('passport-facebook').Strategy,
  request = require('request'),
  app = express();


//Configure view engine
app.set('views', './views');
app.set('view engine', 'pug');

//Configure Passport
passport.use(new Strategy({
    clientID: 323551068232636,
    clientSecret: '2e4bf98c9cc143e4b00cab6a95e2de9b',
    callbackURL: 'http://localhost:3000/login/facebook/return'
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    })
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});

//Logger
app.use(require('morgan')('combined'));
//Needed for passport
app.use(require('cookie-parser')());
//parse body of an HTTP request
app.use(require('body-parser').urlencoded({ extended: true }));
//Password,login stuff
app.use(require('express-session')({ secret: 'topsecretpasscode', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());


//ROUTES
app.get('/', function(req, res) {
    //console.log('\n\n\n' + Object.keys(req.user));
    res.render('login', { user: req.user });
});


app.get('/login', function(req, res){
    res.render('login', { user: req.user });
});


app.get('/api', function(req, res){
    // query strings and their parameters for 'getLegislators'
    let options= {
        method: 'getLegislators',
        id: 'MO',
        apikey: '1dbc81aae134a2b72e3d2cd647b5ab4c',
        output: 'json'
    };

    /*
    request takes two parameters: an object and a function
        The 1st parameter is an object that contains 2 elements: url and qs
            url - The address you want to request
            qs - the query string. In our case, it is 'options', which is an object defined above
        The 2nd parameter is a callback function.
    */
    request({url: 'http://www.opensecrets.org/api', qs: options}, function (error, response, body) {
        console.log('error: ', error); // Print error if one exists, else undefined
        console.log('statusCode: ', response && response.statusCode); // Print the response status code if a response was received

        // parse the json response from body
        let info = JSON.parse(body);

        /*
        http://www.opensecrets.org/api/?method=getLegislators&id=MO&apikey=1dbc81aae134a2b72e3d2cd647b5ab4c
        if you run the above line in your browser you get a bunch of data structured like this:
        ->response
            ->@attribute
                ->Legislator
                    ->firstlast
                    ->party
                    ->etc
            ->@attribute
                -Legislator
                    ->firstlast
                    ->etc
        The line below is how that info is accessed. The legislator array at info.response.legislator[3] refers to the 4th element, aka the 4th legislator in that list.
        */
        let name = info.response.legislator[3]['@attributes']; //json body text reads '@attribute' so the workaround is to enclose it in brackets bc you cant have @ in an object name. so it's basically the same as info.response.legislator[1].attributes
        let people = {};
        for(let i in info.response.legislator){
            people[i] = info.response.legislator[i]['@attributes'];
        }
        //console.log(people[0])
        res.render('api', {
            /*
            in pug we use person.firstlast to generate their Name
            you can do this with any key from the json body, i.e. cid, gender, party
            */
            congress: people
        });

    });
});

//gonna delete this
app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
    console.log("inside return route..");
    res.redirect('/api');
});

app.get('/logout', function(req, res){
  req.logout();
  res.render('logout');
});

app.get('/about', function(req, res){
  req.logout();
  res.render('about');
});
const server = app.listen(3000, function(){
    console.log(`App listening on port ${server.address().port}`);
});
