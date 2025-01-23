// ==UserScript==
// @name         Automatic Nitter Quota & Error Redirector
// @namespace    happyviking
// @version      1.2.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Automatically redirects to another Nitter instance if the one you're directed to has reached its rate limit/quota or has an error.
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

function tryNewInstance(messageHolder) {
    const addedMessage = document.createElement("p")
    addedMessage.textContent = "Redirecting you to new instance..."
    messageHolder.appendChild(addedMessage)
    location.replace('https://farside.link/nitter/' + window.location.pathname + window.location.search);
}

function checkForRateLimit() {
    const errorPanel = document.getElementsByClassName("error-panel").item(0)
    if (!errorPanel) return;
    const errorMessage = errorPanel.querySelector("span")?.innerHTML
    if (!errorMessage) return
    if (errorMessage.includes("Instance has been rate limited.")) {
        tryNewInstance(errorPanel)
    }
}

function checkFor429() {
    const centerPanel = document.querySelector("center")
    if (!centerPanel) return
    const errorMessage = centerPanel.querySelector("h1")?.innerHTML
    if (!errorMessage) return
    if (errorMessage.includes("429 Too Many Requests")) {
        tryNewInstance(centerPanel)
    }
}

checkForRateLimit()
checkFor429()