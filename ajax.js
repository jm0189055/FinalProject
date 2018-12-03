'use strict';

let data = require(states.json);

let ajax_call = function () {
    let request = new XMLHttpRequest();

    request.open('GET', '/ajax', true);

    let failure = () =>
        console.error("Something's gone wrong");

    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            let data = JSON.parse(this.response);
            document.querySelector('#drop').innerHTML = data.message
        } else {
            failure();
        }
    };

    request.onerror = failure;

    request.send();
}

document.querySelector('#submit-state').onclick = ajax_call;
