// ==UserScript==
// @name         Automatic Proxitok Error Redirector
// @namespace    happyviking
// @version      1.0.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Automatically redirects to another proxitok instance if the one you're directed to issues.
// @author       HappyViking

// <<INSTANCES START HERE>>
// @match https://tok.habedieeh.re/*
// <<INSTANCES END HERE>>

// ==/UserScript==

function main() {
    const titles = document.getElementsByClassName("title")
    for (const title of titles){
        if (title.textContent == "There was an error processing your request!"){
            const addedMessage = document.createElement("p")
            addedMessage.textContent = "Redirecting you to new instance..."
            title.parentElement?.appendChild(addedMessage)
            location.replace('https://farside.link/proxitok/' + window.location.pathname + window.location.search);
            return
        }
    }
}

main()

