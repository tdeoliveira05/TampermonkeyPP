// ==UserScript==
// @name         Planswell Sign In Form
// @version      1
// @description  try to take over the world!
// @author       You
// @match        https://docs.google.com/forms/*
// @updateURL    https://raw.githubusercontent.com/tdeoliveira05/TampermonkeyPP/master/signin.js
// @downloadURL  https://raw.githubusercontent.com/tdeoliveira05/TampermonkeyPP/master/signin.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function runTimer () {
        // Check if the required link element is present
     var tempLink = document.getElementsByClassName("freebirdFormviewerViewResponseLinksContainer")[0].getElementsByTagName("a")[0].href

     if (tempLink) {
         // If element is present, redirect the browser to a new form submit page. Rinse and repeat.
         window.location.href = tempLink;
     }
    }

    setInterval ( () => {
        // Every 5 seconds, check if the user is in a google form
        if (document.URL.startsWith("https://docs.google.com/forms")) {
            //If true, run the timer for link click
            runTimer()
        }


    }, 5000)
})();
