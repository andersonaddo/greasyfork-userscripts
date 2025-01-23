// ==UserScript==
// @name         New Instance Button for Nitter
// @namespace    happyviking
// @version      1.55.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Adds a button to Nitter instances to redirect to a new instance.
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Nitter_logo.svg/1024px-Nitter_logo.svg.png
// @author       HappyViking

// <<INSTANCES START HERE>>
// @match https://lightbrd.com/*
// @match https://nitter.poast.org/*
// @match https://nitter.privacydev.net/*
// @match https://xcancel.com/*
// @match https://nitter.lucabased.xyz/*
// <<INSTANCES END HERE>>


// ==/UserScript==

function main() {
    const firstNavItem = document.querySelector('.nav-item');
    if (!firstNavItem) return
    const newButton = document.createElement("button")
    firstNavItem.prepend(newButton)
    newButton.appendChild(document.createTextNode("New Instance"))
    newButton.onclick = () => {
        location.replace('https://farside.link/nitter/' + window.location.pathname + window.location.search);
    }
}

main()  