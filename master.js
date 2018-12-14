// ==UserScript==
// @name         Planswell - TamperMonkey for Plan Pros
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Salesforce General UI Manipulations
// @author       You
// @match        https://planswell.lightning.force.com/*
// @updateURL    https://raw.githubusercontent.com/tdeoliveira05/TampermonkeyPP/master/master.js
// @downloadURL  https://raw.githubusercontent.com/tdeoliveira05/TampermonkeyPP/master/master.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // test

    //---------------------------------------------- Task List Color Coding -------------------------------------------//

    // A function to extract the title of each link (aka "Anchors") in the task list. A list of all titles with priority codes is returned to the function.
    function matchAllAnchors (priorityObjs) {
        var anchors = document.getElementsByTagName('a');
        var anchorArray = [];
        var priorityCodes = [];

        priorityObjs.forEach((item) => {
            priorityCodes.push(item.code)
        })

        for (var item of anchors) {
            if (item.title) {
                var letterArray = item.title.split('');
                priorityObjs.forEach((obj) => {
                    if (letterArray[0] === obj.code) {
                        var anchorObj = {
                            anchor: item,
                            meta: obj
                        }
                        anchorArray.push(anchorObj)
                    }
                })
            }
        }
        return anchorArray;
    }

    // A function to execute the color coding by reading an array of information objects contain an anchor element and it's color coding metadata
    function colorCodeActivate(anchorArray) {

        anchorArray.forEach((arrayObj) => {
            var tableRow = arrayObj.anchor.parentNode.parentNode.parentNode
            tableRow.setAttribute("style", "background-color: " + arrayObj.meta.color + " !important;");
        })

    }

    /*
     *----------------------------------------
     * The primary executable function to call
     *----------------------------------------
     */

    function taskListColorCoding () {
        var priorityObjs = [
            {
                code: "*",
                description: "Urgent",
                color: "#FFC6C6"
            },
            {
                code: "!",
                description: "Important",
                color: "#FFE9C6"
            }
        ]

        var anchorArray = matchAllAnchors(priorityObjs);
        colorCodeActivate(anchorArray);
    }

    //------------------------------------------------------------------------------------------------------------------//

    //---------------------------------------- 2-second Userscript Loop ------------------------------------------------//

    setInterval(() => {
        // Run color coding if user is in the task list view
        if (document.URL.startsWith('https://planswell.lightning.force.com/lightning/o/Task/list')) {
            taskListColorCoding();
        }
    }, 2000);


})();
