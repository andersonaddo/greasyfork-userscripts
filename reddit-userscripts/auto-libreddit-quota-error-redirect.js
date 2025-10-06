// ==UserScript==
// @name         Automatic Redlib Quota & Error Redirector
// @namespace    happyviking
// @version      1.68.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Automatically redirects to another Redlib (previously Libreddit) instance if the one you're directed to has reached its rate limit/quota or has an error.
// @icon         https://gitlab.com/uploads/-/system/project/avatar/32545239/libreddit.png
// @author       HappyViking

// <<INSTANCES START HERE>>
// @match https://libreddit.diffraction.dev/*
// @match https://libreddit.privacydev.net/*
// @match https://red.artemislena.eu/*
// @match https://reddit.adminforge.de/*
// @match https://reddit.nerdvpn.de/*
// @match https://reddit.rtrace.io/*
// @match https://redlib.catsarch.com/*
// @match https://redlib.minihoot.site/*
// @match https://redlib.orangenet.cc/*
// @match https://redlib.perennialte.ch/*
// @match https://redlib.privacyredirect.com/*
// @match https://redlib.privadency.com/*
// @match https://redlib.r4fo.com/*
// @match https://redlib.thebunny.zone/*
// @match https://rl.blitzw.in/*
// @match https://safereddit.com/*
// @match https://red.ngn.tf/*
// @match https://redlib.scanash.xyz/*
// @match https://rl.bloat.cat/*
// @match https://redlib.4o1x5.dev/*
// @match https://eu.safereddit.com/*
// @match https://lr.ptr.moe/*
// @match https://redlib.nadeko.net/*
// @match https://redlib.tux.pizza/*
// @match https://l.opnxng.com/*
// @match https://libreddit.bus-hit.me/*
// @match https://libreddit.projectsegfau.lt/*
// @match https://lr.ggtyler.dev/*
// @match https://lr.n8pjl.ca/*
// @match https://r.darrennathanael.com/*
// @match https://red.arancia.click/*
// @match https://redlib.baczek.me/*
// @match https://redlib.ducks.party/*
// @match https://redlib.freedit.eu/*
// @match https://redlib.frontendfriendly.xyz/*
// @match https://redlib.incogniweb.net/*
// @match https://redlib.nirn.quest/*
// @match https://redlib.nohost.network/*
// @match https://redlib.privacy.com.de/*
// @match https://redlib.private.coffee/*
// @match https://redlib.reallyaweso.me/*
// @match https://redlib.seasi.dev/*
// @match https://redlib.vimmer.dev/*
// @match https://rl.rootdo.com/*
// @match https://lr.quitaxd.online/*
// @match https://redlib.nezumi.party/*
// @match https://redlib.kittywi.re/*
// @match https://reddit.idevicehacked.com/*
// @match https://redlib.privacy.deals/*
// @match https://reddit.owo.si/*
// @match https://redlib.dnfetheus.xyz/*
// @match https://libreddit.eu.org/*
// @match https://reddit.invak.id/*
// @match https://redlib.cow.rip/*
// @match https://redlib.xn--hackerhhle-kcb.org/*
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

const checkForUnexpectedPage = () => {
    const isInNormalPage = !!document.querySelector('nav');
    const isInAnubis = !!document.getElementById("anubis_version")
    const isMediaPreviewPage = window.location.pathname.includes("preview")
    const isCloudflarePage = document.title.includes('Just a moment') ||
        document.querySelector('#challenge-running') !== null;

    if (!isInAnubis && !isCloudflarePage && !isInNormalPage && !isMediaPreviewPage) {
        return document.body
    }
    return null

}

const checkForRedlibError = () => {
    const errorElement = document.getElementById("error")
    if (!errorElement) return false;
    const errorMessage = errorElement.querySelector("h1")?.innerHTML
    if (!errorMessage) return false;

    const message = errorMessage.toLowerCase()

    const hasError =
        message.includes("too many requests") ||
        message.includes("failed to parse page json data") ||
        message.includes("rate limit")

    if (hasError) return errorElement
    return null
}

// Probably isn't needed because of checkForUnexpectedPage now
const checkForNginxError = () => {
    const errorElement = document.getElementsByTagName("h1").item(0)
    if (!errorElement) return false

    const hasError = errorElement.innerHTML === "502 Bad Gateway" ||
        errorElement.innerHTML === "503 Service Temporarily Unavailable"

    if (hasError) return errorElement
    return null
}

function main() {
    const errorElement = checkForUnexpectedPage() ?? checkForNginxError() ?? checkForRedlibError()
    if (errorElement) {
        const addedMessage = document.createElement("p")
        addedMessage.textContent = "Redirecting you to new instance..."
        errorElement.appendChild(addedMessage)
        location.replace('https://farside.link/redlib/' + window.location.pathname + window.location.search);
    }
}

main()

