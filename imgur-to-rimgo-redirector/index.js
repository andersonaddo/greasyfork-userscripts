// ==UserScript==
// @name         Imgur to Rimgo
// @namespace    happyviking
// @version      1.0
// @description  Converts Imgur.io links to Rimgo links, and replaces old url in browser history.
// @author       HappyViking
// @match        *://*.imgur.io/*
// @icon        https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Imgur_icon.svg/120px-Imgur_icon.svg.png
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==


function isProperTargetPage(url) {
    return !!url.match(/^(|http(s?):\/\/)(.*\.)?imgur.io(\/.*|$)/gim);
}

function getNewUrl(url) {
    //not using https://farside.link/rimgo cuz a lot of those don't actually work
    return 'https://rimgo.hostux.net' + url.split('imgur.io').pop();
}

if (isProperTargetPage(window.location.href)) {
    const newUrl = getNewUrl(window.location.href)
    location.replace(newUrl);
}
