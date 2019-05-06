// ==UserScript==
// @name         Planswell Sign In Form
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://docs.google.com/forms/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function runTimer () {
     var tempLink = document.getElementsByClassName("freebirdFormviewerViewResponseLinksContainer")[0].getElementsByTagName("a")[0].href

     if (tempLink) {
         window.location.href = tempLink;
     }
    }

    setInterval ( () => {
        if (document.URL.startsWith("https://docs.google.com/forms")) {
            runTimer()
        }


    }, 5000)
})();
