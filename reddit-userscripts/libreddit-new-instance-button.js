// ==UserScript==
// @name         New Instance Button for Libreddit 
// @namespace    happyviking
// @version      1
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Adds a button to Libreddit instances to redirect to a new instance
// @icon         https://gitlab.com/uploads/-/system/project/avatar/32545239/libreddit.png
// @author       HappyViking

// <<INSTANCES START HERE>>
// [Will be automatically updated by Github Actions]
// @match https://reddi.tk/*
// <<INSTANCES END HERE>>


// ==/UserScript==

function main() {
    const navBar = document.querySelector('nav');
    if (!navBar) return
    const firstDivInNavBar = navBar.querySelector("div")
    const newButton = document.createElement("button")
    firstDivInNavBar.prepend(newButton)
    newButton.appendChild(document.createTextNode("New Instance"))
    newButton.onclick = () => {
        console.log("hi")
        location.replace('https://farside.link/libreddit/' + window.location.pathname);
    }
}

main()  