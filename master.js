// ==UserScript==
// @name         Planswell - TamperMonkey for Plan Pros
// @namespace    http://tampermonkey.net/
// @version      8
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
    //---------------------------------------------- Task List Color Coding -------------------------------------------//

    // A function to extract the title of each link (aka "Anchors") in the task list. A list of all titles with priority codes is returned to the function.
    function matchAllAnchors (criteria) {
        var anchors = document.getElementsByTagName('a');
        var anchorArray = [];
        var criteriaCodes = [];

        criteria.forEach((item) => {
            criteriaCodes.push(item.code)
        })

        for (var item of anchors) {
            if (item.title) {
                var letterArray = item.title.split('');
                criteria.forEach((obj) => {
                    var anchorObj
                    if (letterArray[0] === obj.code) {
                        anchorObj = {
                            anchor: item,
                            meta: obj
                        }
                        anchorArray.push(anchorObj)
                    } else if (letterArray.join("").toLowerCase().startsWith("trading")) {
                        // Special case to highlight tasks starting with "trading"
                        anchorObj = {
                            anchor: item,
                            meta: {
                                highlight: "background-color",
                                color: {
                                    standard: "#a2e8c3",
                                    hover: "#a2e8c3"
                                }
                            }
                        }
                        anchorArray.push(anchorObj)
                    }

                })
            }
        }
        return anchorArray;
    }

    // A function to execute the removal of code from the task title
    function removeCodeFromText (arrayObj) {
        var letterArray = arrayObj.anchor.title.split('')
        var code = arrayObj.anchor.title.split('')[0]

        for (var i = 0; i < letterArray.length; i++) {
            if (letterArray[i] === code || letterArray[i] === ' ') {
                letterArray.splice(i, 1);
                i--;
            } else {
                break;
            }
        }

        arrayObj.anchor.innerHTML = letterArray.join('')
        return arrayObj
    }

    // A function to execute the color coding by reading an array of information objects contain an anchor element and it's color coding metadata
    function colorCodeActivate(anchorArray, optionalVariables) {

        // console.log(anchorArray)

        if (optionalVariables) {
            anchorArray.forEach((arrayObj) => {

                if (optionalVariables.removeCodeFromText) {
                    arrayObj = removeCodeFromText(arrayObj);
                }

                var tableRow = arrayObj.anchor.parentNode.parentNode.parentNode
                tableRow.setAttribute("style", arrayObj.meta.highlight + " : " + arrayObj.meta.color.standard + " !important;");
            })

        } else {
            anchorArray.forEach((arrayObj) => {
                var tableRow = arrayObj.anchor.parentNode.parentNode.parentNode
                tableRow.setAttribute("style", arrayObj.meta.highlight + " : " + arrayObj.meta.color.standard + " !important;");
            })
        }

        

    }

    /*
     *----------------------------------------
     * The primary executable function to call
     *----------------------------------------
     */

    function taskListColorCoding () {
        var criteria = [
            {
                code: "*",
                type: "priority",
                highlight: "background-color",
                color: {
                    standard: "#FFC6C6",
                    hover: "#FFC6C6"
                }
            },
            {
                code: "!",
                type: "priority",
                highlight: "background-color",
                color: {
                    standard: "#FFE9C6",
                    hover: "#FFE9C6"
                }
            },
            {
                code: "^",
                description: "Assigned to Investment Specialist",
                color: {
                    standard: "#FF69B4",
                    hover: "#FF69B4"
                }
            },
            {
                code: "-",
                description: "Investment Specialist Reference",
                color: {
                    standard: "#A9A9A9",
                    hover: "#A9A9A9"
                }
            }
        ]

        var optionalVariables = {
            'removeCodeFromText': false
        }

        var anchorArray = matchAllAnchors(criteria);
        colorCodeActivate(anchorArray, optionalVariables);
    }

    //-------------------------------------------------- Duplicate Alarm -----------------------------------------------//

    // A function to check whether there are more than zero duplicates on this lead by trying to read a number from the duplicate banner
    function duplicatePresent (duplicateBanner) {
        var check = false;


        var hasNumbersFunction = /\d/

        var duplicateText = duplicateBanner.getElementsByTagName('span')[1].textContent

        if (hasNumbersFunction.test(duplicateText)) {
            check = true
            //console.log("Duplicate found")
        } else {
            //console.log("No duplicate found")
        }




        return check
    }


    /*
     *----------------------------------------
     * The primary executable function to call
     *----------------------------------------
     */

    function duplicateAlarm () {

        var duplicateBanner

        if (document.getElementsByTagName('header')[2]) {
            duplicateBanner = document.getElementsByTagName('header')[2]
        } else {
            return
        }

        if (duplicatePresent(duplicateBanner) && duplicateBanner) {
            duplicateBanner.parentNode.parentNode.setAttribute("style", "background-color: #FFC6C6 !important")
            document.getElementsByTagName('header')[2].parentNode.getElementsByTagName("a")[0].setAttribute("style", "font-size: 1.6em !important")
            console.log('Alarm being set off')
        } else {
            console.log("No alarm set off");
        }
    }

    //---------------------------------------------- automaticTaskPop -------------------------------------------//
    function automaticTaskPop() {

        // If the element does not have a "checked" attribute, then the user just checked off a checkbox
        var tempElement = document.querySelectorAll("a[data-tab-name = NewTask]")[0]
        tempElement.setAttribute("style", "background-color: #FFC6C6 !important")

        if (tempElement.getAttribute("aria-selected") === "false") {
            // Click on the tab if it is not yet activated
            tempElement.click()
        } else {
            // Access the ui button for a new task if the user is already on the task tab
            document.getElementsByClassName("slds-button slds-button--brand testid__dummy-button-submit-action slds-col slds-no-space dummyButtonSubmitAction uiButton")[0].click()
        }



        


        return
    }


    //------------------------------------------------------------------------------------------------------------------//
    //---------------------------------------- Document event listener ------------------------------------------------//

    // Add relevant click events
    document.addEventListener('click', function (event) {
        // Prevent email sent without subject line
        if (event.srcElement.className === "inputCheckbox" && !event.srcElement.getAttribute("checked") && (document.URL.startsWith('https://planswell.lightning.force.com/lightning/r/Lead/') || document.URL.startsWith('https://planswell.lightning.force.com/lightning/r/Account/'))) {
            automaticTaskPop()
        }
    })

    //------------------------------------------------------------------------------------------------------------------//
    //---------------------------------------- 2-second Userscript Loop ------------------------------------------------//

    setInterval(() => {


        // Run color coding if user is in the task list view
        if (document.URL.startsWith('https://planswell.lightning.force.com/lightning/o/Task/')) {
            taskListColorCoding();
        }

        // Run duplicate alarm if duplicates are found
        if (document.URL.startsWith('https://planswell.lightning.force.com/lightning/r/Lead/')) {
            //console.log("lead alarm fired");
            duplicateAlarm();

        }


        

    }, 2000);


})();

