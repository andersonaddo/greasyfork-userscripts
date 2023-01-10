// ==UserScript==
// @name     HackerNews Post Hider (based on post Domains and Titles)
// @match https://news.ycombinator.com/
// @match https://news.ycombinator.com/?p=*
// @version  2.0
// @grant    none
// @namespace ahappyviking
// @license MIT
// @description Simply hides posts from specific user-specified domains on HackerNews front page
// @icon https://www.kindpng.com/picc/m/61-613142_see-no-evil-monkey-icon-monkey-eyes-closed.png
// ==/UserScript==

let hiddenDomains = ["dailymail.co.uk", "cbsnews.com"]
let hiddenTitleKeywords = ["chatgpt", "gpt"] //These should stay lowercase...
 
function hncleaner_main() {

    let numberOfBlocked = 0

    //First blocking based on domains...
    let links = document.getElementsByClassName("sitestr");
    for (let link of links) {
        if (hiddenDomains.includes(link.innerHTML)) {
            hidepost_hidePost(link.closest(".athing"))
            numberOfBlocked++
            continue
        }

        //While we're here we might as well find the title of this post and potentially block based on that...
        let titleHolder = link.closest(".titleline")
        const title = titleHolder.firstChild.textContent.toLocaleLowerCase()
        for (const word of hiddenTitleKeywords){
            if (!title.includes(word)) continue;
            hidepost_hidePost(link.closest(".athing"))
            numberOfBlocked++
            break
        }
       

    }
    if (numberOfBlocked) {
        hncleaner_addBlockCount(numberOfBlocked);
    }
}
 
function hncleaner_createBlockNotice() {
    //Acually decided to have this return null just to make things cleaner
    const notice = document.createElement("div");
    return notice
}

function hidepost_hidePost(owner){
    owner.nextElementSibling?.nextElementSibling?.remove() //Removing "spacer" element
    owner.nextElementSibling?.remove() //Removing comments
    owner.replaceWith(hncleaner_createBlockNotice()) //Removing title
}
 
function hncleaner_addBlockCount(blockCount) {
    const text = document.createElement("p")
    text.style.margin = "0 0 8 0"
    text.style.userSelect = "none"
    text.innerText = `Hidden posts: ${blockCount}`
    text.style.color = "grey"
    text.style.fontSize = "10px"
    document.getElementById("pagespace")?.after(text)
}
 
hncleaner_main()