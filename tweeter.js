'use strict';


let Twit = require('twit');
let config = require('./config')
let T = new Twit(config);


let tweet = {
status: 'Open secrets test' }
// this is the tweet message

T.post('statuses/update', tweet, tweeted)
function tweeted(err, data, response) {
    if (err) {
        console.log("An error occured");
    }
    else {
        console.log("It's working!");
    }
}
