// ==UserScript==
// @name         Automatic Libreddit Quota Redirector
// @namespace    happyviking
// @version      1
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Automatically redirects to another Libreddit instance if the one you're directed to has reached its rate limit/quota.
// @icon         https://gitlab.com/uploads/-/system/project/avatar/32545239/libreddit.png
// @author       HappyViking

// <<INSTANCES START HERE>>
// [Will be automatically updated by Github Actions]
// <<INSTANCES END HERE>>

// ==/UserScript==

function main() {
    const errorMessage = document.getElementById("error")
    if (!errorMessage) return;
    if(!errorMessage.querySelector("h1")?.innerHTML.includes("Too Many Requests")) return;
    const addedMessage = document.createElement("p")
    addedMessage.textContent = "Redirecting you to new instance..."
    errorMessage.appendChild(addedMessage)
    location.replace('https://farside.link/libreddit/' + window.location.pathname);
}

main()

