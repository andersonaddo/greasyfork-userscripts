// ==UserScript==
// @name         Twitter Login Blocker to Nitter
// @namespace    happyviking
// @version      1.0
// @description  Converts Twitter login flow redirects to Nitter links, and replaces old url in browser history. Also works in Firefox Android.
// @author       HappyViking
// @match	     *://*.twitter.com/i/flow/login*
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

function isProperTargetPage(url) {
    return !!url.match(/^(|http(s?):\/\/)(.*\.)?twitter.com(\/.*|$)/gim);
}

function getNewUrl() {
  	let params = new URL(document.location).searchParams;
  	let name = params.get("redirect_after_login")?.trim();
    return `https://farside.link/nitter/${name ?? ""}`
}

if (isProperTargetPage(window.location.href)) {
    const newUrl = getNewUrl()
    location.replace(newUrl);
}
