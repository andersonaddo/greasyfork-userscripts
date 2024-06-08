// ==UserScript==
// @name         Twitter Login Blocker to Nitter
// @namespace    happyviking
// @version      2.0
// @description  Converts Twitter login flow redirects to Nitter links, and replaces old url in browser history. Also works in Firefox Android.
// @author       HappyViking
// @match	     *://*.twitter.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

function isProperTargetPage(url) {
    return !!url.match(/^(|http(s?):\/\/)(.*\.)?twitter.com\/i\/flow\/login(.*|$)/gim);
}

function getNewUrl() {
    let params = new URL(document.location).searchParams;
    let name = params.get("redirect_after_login")?.trim();
    return `https://farside.link/nitter/${name ?? ""}`
}


const main = () => {
    if (isProperTargetPage(window.location.href)) {
        const newUrl = getNewUrl()
        location.replace(newUrl);
    }
}

//There are probably cleaner ways to do this but I don't really care, this works and is simple
let currentPage = location.href;
main()
setInterval(() => {
    if (currentPage != location.href) {
        currentPage = location.href;
        main()
    }
}, 500);
