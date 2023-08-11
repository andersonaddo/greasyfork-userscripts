// ==UserScript==
// @name         New Instance Button for Libreddit 
// @namespace    happyviking
// @version      1.15.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Adds a button to Libreddit instances to redirect to a new instance
// @icon         https://gitlab.com/uploads/-/system/project/avatar/32545239/libreddit.png
// @author       HappyViking

// <<INSTANCES START HERE>>
// @match https://l.opnxng.com/*
// @match https://libreddit.bus-hit.me/*
// @match https://libreddit.cachyos.org/*
// @match https://libreddit.domain.glass/*
// @match https://libreddit.freedit.eu/*
// @match https://libreddit.hu/*
// @match https://libreddit.kutay.dev/*
// @match https://libreddit.kylrth.com/*
// @match https://libreddit.lunar.icu/*
// @match https://libreddit.mha.fi/*
// @match https://libreddit.northboot.xyz/*
// @match https://libreddit.oxymagnesium.com/*
// @match https://libreddit.privacy.com.de/*
// @match https://libreddit.privacydev.net/*
// @match https://libreddit.projectsegfau.lt/*
// @match https://libreddit.pussthecat.org/*
// @match https://libreddit.tiekoetter.com/*
// @match https://libreddit.tux.pizza/*
// @match https://lr.4201337.xyz/*
// @match https://lr.aeong.one/*
// @match https://lr.artemislena.eu/*
// @match https://lr.slipfox.xyz/*
// @match https://lr.vern.cc/*
// @match https://r.darklab.sh/*
// @match https://r.nf/*
// @match https://r.walkx.fyi/*
// @match https://rd.funami.tech/*
// @match https://reddit.baby/*
// @match https://reddit.dr460nf1r3.org/*
// @match https://reddit.leptons.xyz/*
// @match https://reddit.rtrace.io/*
// @match https://reddit.smnz.de/*
// @match https://reddit.utsav2.dev/*
// @match https://safereddit.com/*
// @match https://snoo.habedieeh.re/*
// <<INSTANCES END HERE>>


// ==/UserScript==

function main() {
    const navBar = document.querySelector('nav');
    if (!navBar) return
    const firstDivInNavBar = navBar.querySelector("div")
    const newButton = document.createElement("button")
    firstDivInNavBar.prepend(newButton)
    newButton.appendChild(document.createTextNode("New Instance"))
    newButton.onclick = () => {
        console.log("hi")
        location.replace('https://farside.link/libreddit/' + window.location.pathname);
    }
}

main()  