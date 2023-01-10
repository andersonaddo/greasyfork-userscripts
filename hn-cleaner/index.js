// ==UserScript==
// @name     Hide Domains on HackerNews
// @match https://news.ycombinator.com/
// @match https://news.ycombinator.com/?p=*
// @version  1.2 
// @grant    none
// @namespace ahappyviking
// @license MIT
// @description Simply hides posts from specific user-specified domains on HackerNews front page
// @icon https://www.kindpng.com/picc/m/61-613142_see-no-evil-monkey-icon-monkey-eyes-closed.png
// ==/UserScript==
 
//No real change here, just testing the webhooks

let hiddenDomains = ["dailymail.co.uk"]
 
function hidedomainsonhn_main() {
    let links = document.getElementsByClassName("sitestr");
    let numberOfBlocked = 0
 
    for (let link of links) {
        if (hiddenDomains.includes(link.innerHTML)) {
            let owner = link.closest(".title");
            owner.firstChild?.replaceWith(hidedomainsonhn_createBlockNotice(link.innerHTML))
            numberOfBlocked++
        }
    }
 
    if (numberOfBlocked) {
        hidedomainsonhn_addBlockCount(numberOfBlocked);
    }
}
 
function hidedomainsonhn_createBlockNotice(domain) {
    const notice = document.createElement("p");
    notice.innerText = domain
    notice.style.width = "fit-content"
    notice.style.fontSize = "10px"
    notice.style.padding = "2px"
    notice.style.textDecoration = "line-through"
    return notice
}
 
function hidedomainsonhn_addBlockCount(blockCount) {
    const text = document.createElement("p")
    text.style.margin = "0 0 8 0"
    text.style.userSelect = "none"
    text.innerText = `Blocked domains: ${blockCount}`
    text.style.color = "grey"
    text.style.fontSize = "10px"
    document.getElementById("pagespace")?.after(text)
}
 
hidedomainsonhn_main()