// ==UserScript==
// @name         Tiktok to Proxitok
// @namespace    happyviking
// @version      1.0
// @description  Converts Tiktok links to Proxitok links, and replaces old url in browser history. Also works in Firefox Android.
// @author       HappyViking
// @match        *://*.tiktok.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

function isProperTargetPage(url) {
    return !!url.match(/^(|http(s?):\/\/)(.*\.)?tiktok.com(\/.*|$)/gim);
}

function getNewUrl(url) {
    return 'https://farside.link/proxitok' + url.split('tiktok.com').pop();
}

if (isProperTargetPage(window.location.href)) {
    const newUrl = getNewUrl(window.location.href)
    location.replace(newUrl);
}
