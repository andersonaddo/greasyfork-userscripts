// ==UserScript==
// @name         Libreddit instance blacklist
// @namespace    happyviking
// @version      1.0.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Automatically redirects to another Libreddit if you land on a chronically unreliable one.
// @icon         https://gitlab.com/uploads/-/system/project/avatar/32545239/libreddit.png
// @author       HappyViking

// @match https://reddit.invak.id/*
// @match https://reddit.simo.sh/* 

// ==/UserScript==

function main() {
    const bodies = document.getElementsByTagName("body")
    if (bodies.length > 0){
        const addedMessage = document.createElement("p")
        addedMessage.textContent = "Redirecting you to new instance..."
        bodies[0].prepend(addedMessage)
    }
    location.replace('https://farside.link/libreddit/' + window.location.pathname + window.location.search);
}

main()

