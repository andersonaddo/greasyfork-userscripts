// ==UserScript==
// @name         Automatic Redlib Quota & Error Redirector
// @namespace    happyviking
// @version      1.57.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Automatically redirects to another Redlib (previously Libreddit) instance if the one you're directed to has reached its rate limit/quota or has an error.
// @icon         https://gitlab.com/uploads/-/system/project/avatar/32545239/libreddit.png
// @author       HappyViking

// <<INSTANCES START HERE>>
// @match https://l.opnxng.com/*
// @match https://libreddit.bus-hit.me/*
// @match https://libreddit.privacydev.net/*
// @match https://libreddit.projectsegfau.lt/*
// @match https://lr.n8pjl.ca/*
// @match https://red.arancia.click/*
// @match https://red.artemislena.eu/*
// @match https://red.ngn.tf/*
// @match https://reddit.nerdvpn.de/*
// @match https://redlib.4o1x5.dev/*
// @match https://redlib.catsarch.com/*
// @match https://redlib.ducks.party/*
// @match https://redlib.freedit.eu/*
// @match https://redlib.kittywi.re/*
// @match https://redlib.nohost.network/*
// @match https://redlib.perennialte.ch/*
// @match https://redlib.privacyredirect.com/*
// @match https://redlib.private.coffee/*
// @match https://redlib.vimmer.dev/*
// @match https://rl.bloat.cat/*
// @match https://rl.rootdo.com/*
// @match https://lr.ggtyler.dev/*
// @match https://r.darrennathanael.com/*
// @match https://reddit.idevicehacked.com/*
// @match https://redlib.baczek.me/*
// @match https://redlib.incogniweb.net/*
// @match https://redlib.nadeko.net/*
// @match https://redlib.nirn.quest/*
// @match https://redlib.privacy.deals/*
// @match https://redlib.tux.pizza/*
// @match https://reddit.owo.si/*
// @match https://redlib.dnfetheus.xyz/*
// @match https://redlib.nezumi.party/*
// @match https://redlib.seasi.dev/*
// @match https://safereddit.com/*
// @match https://libreddit.eu.org/*
// @match https://reddit.invak.id/*
// @match https://redlib.cow.rip/*
// @match https://redlib.r4fo.com/*
// @match https://redlib.xn--hackerhhle-kcb.org/*
// @match https://eu.safereddit.com/*
// @match https://redlib.matthew.science/*
// @match https://libreddit.freedit.eu/*
// @match https://libreddit.hu/*
// @match https://libreddit.kylrth.com/*
// @match https://libreddit.lunar.icu/*
// @match https://libreddit.mha.fi/*
// @match https://libreddit.northboot.xyz/*
// @match https://libreddit.oxymagnesium.com/*
// @match https://libreddit.pussthecat.org/*
// @match https://libreddit.spike.codes/*
// @match https://libreddit.strongthany.cc/*
// @match https://libreddit.tiekoetter.com/*
// @match https://lr.4201337.xyz/*
// @match https://lr.aeong.one/*
// @match https://lr.artemislena.eu/*
// @match https://lr.slipfox.xyz/*
// @match https://r.walkx.fyi/*
// @match https://reddit.rtrace.io/*
// @match https://reddit.simo.sh/*
// @match https://reddit.smnz.de/*
// @match https://reddit.utsav2.dev/*
// @match https://snoo.habedieeh.re/*
// @match https://libreddit.kutay.dev/*
// @match https://libreddit.tux.pizza/*
// @match https://lr.vern.cc/*
// @match https://r.darklab.sh/*
// @match https://reddit.leptons.xyz/*
// @match https://discuss.whatever.social/*
// @match https://libreddit.kavin.rocks/*
// @match https://libreddit.cachyos.org/*
// @match https://libreddit.domain.glass/*
// @match https://libreddit.privacy.com.de/*
// @match https://reddit.baby/*
// <<INSTANCES END HERE>>

// ==/UserScript==

function main() {
    const errorElement = document.getElementById("error")
    if (!errorElement) return;
    const errorMessage = errorElement.querySelector("h1")?.innerHTML
    if (!errorMessage) return
    
    if (errorMessage.includes("Too Many Requests") || 
        errorMessage.includes("Failed to parse page JSON data")){
        const addedMessage = document.createElement("p")
        addedMessage.textContent = "Redirecting you to new instance..."
        errorElement.appendChild(addedMessage)
        location.replace('https://farside.link/redlib/' + window.location.pathname + window.location.search);
    }
}

main()

