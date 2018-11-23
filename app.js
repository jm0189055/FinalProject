'use strict';

let express = require('express'),
    app = express();


app.set('views', './views');
app.set('view engine', 'pug');


app.get('/', function(req, res){
  res.render('index', {
    title: 'Final Project'
  });
});


app.listen(3000, function(){
  console.log('App is listening on port 3000');
});
