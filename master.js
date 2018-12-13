// ==UserScript==
// @name         Planswell - TamperMonkey for Plan Pros
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Salesforce General UI Manipulations
// @author       You
// @match        https://planswell.lightning.force.com/*
// @updateURL    https://raw.githubusercontent.com/tdeoliveira05/TampermonkeyPP/master/master.js
// @downloadURL  https://raw.githubusercontent.com/tdeoliveira05/TampermonkeyPP/master/master.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var priorityKeys = {
        '**': 'Urgent',
        '!!': 'High'
    }

    // A function to extract the title of each link (aka "Anchors") in the task list. A list of all titles with priority codes is returned to the function.
    function matchAllAnchors (priorityKeys) {
        var anchors = document.getElementsByTagName('a');
        var anchorArray = [];

        for (var item of anchors) {
            if (item.title) {
                var letterArray = item.title.split('');
                if (letterArray[0] === '*' || letterArray[0] === '!') {
                    console.log('Priority tasks detected');
                    anchorArray.push(item)
                }
            }
        }

        return anchorArray;
    }

    function colorCodeActivate(anchorArray) {
        anchorArray.forEach((item) => {

            if (item.title.split('')[0] === '*') {item.parentNode.parentNode.parentNode.setAttribute("style", "background-color: #FFC6C6 !important;");}
            if (item.title.split('')[0] === '!') {item.parentNode.parentNode.parentNode.setAttribute("style", "background-color: #FFE9C6 !important;");}
        })
    }

    window.addEventListener("click", function (priorityKeys) {
        var anchorArray = matchAllAnchors(priorityKeys);
        colorCodeActivate(anchorArray, priorityKeys);
    })
})();
