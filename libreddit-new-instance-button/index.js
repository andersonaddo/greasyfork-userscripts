// ==UserScript==
// @name         New Instance Button for Libreddit 
// @namespace    happyviking
// @version      1
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Adds a button to Libreddit instances to redirect to a new instance
// @icon         https://gitlab.com/uploads/-/system/project/avatar/32545239/libreddit.png
// @author       HappyViking

// Making patterns to match https://github.com/benbusby/farside/blob/main/services-full.json
// @match https://l.opnxng.com/*
// @match https://libreddit.bus-hit.me/*
// @match https://libreddit.cachyos.org/*
// @match https://libreddit.dcs0.hu/*
// @match https://libreddit.de/*
// @match https://libreddit.domain.glass/*
// @match https://libreddit.freedit.eu/*
// @match https://libreddit.garudalinux.org/*
// @match https://libreddit.hu/*
// @match https://libreddit.kavin.rocks/*
// @match https://libreddit.kutay.dev/*
// @match https://libreddit.kylrth.com/*
// @match https://libreddit.lunar.icu/*
// @match https://libreddit.mha.fi/*
// @match https://libreddit.nl/*
// @match https://libreddit.northboot.xyz/*
// @match https://libreddit.oxymagnesium.com/*
// @match https://libreddit.privacy.com.de/*
// @match https://libreddit.projectsegfau.lt/*
// @match https://libreddit.pussthecat.org/*
// @match https://libreddit.strongthany.cc/*
// @match https://libreddit.tiekoetter.com/*
// @match https://libreddit.tux.pizza/*
// @match https://lr.4201337.xyz/*
// @match https://lr.artemislena.eu/*
// @match https://lr.riverside.rocks/*
// @match https://lr.slipfox.xyz/*
// @match https://lr.vern.cc/*
// @match https://r.ahwx.org/*
// @match https://r.darklab.sh/*
// @match https://r.nf/*
// @match https://r.walkx.fyi/*
// @match https://rd.funami.tech/*
// @match https://reddi.tk/*
// @match https://reddit.baby/*
// @match https://reddit.dr460nf1r3.org/*
// @match https://reddit.leptons.xyz/*
// @match https://reddit.moe.ngo/*
// @match https://reddit.rtrace.io/*
// @match https://reddit.smnz.de/*
// @match https://reddit.utsav2.dev/*
// @match https://safereddit.com/*
// @match https://snoo.habedieeh.re/*


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