// ==UserScript==
// @name         [Buggy] Redlib Quirk Fixer
// @namespace    happyviking
// @version      1.21.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Fix some quirks of Redlib (previously Libreddit) instances (disabled HLS, disabled NSFW, etc). Buggy, see README.
// @icon         https://gitlab.com/uploads/-/system/project/avatar/32545239/libreddit.png
// @author       HappyViking

// <<INSTANCES START HERE>>
// @match https://l.opnxng.com/*
// @match https://libreddit.bus-hit.me/*
// @match https://libreddit.privacydev.net/*
// @match https://libreddit.projectsegfau.lt/*
// @match https://lr.ggtyler.dev/*
// @match https://lr.n8pjl.ca/*
// @match https://r.darrennathanael.com/*
// @match https://red.arancia.click/*
// @match https://red.artemislena.eu/*
// @match https://red.ngn.tf/*
// @match https://reddit.nerdvpn.de/*
// @match https://redlib.baczek.me/*
// @match https://redlib.catsarch.com/*
// @match https://redlib.ducks.party/*
// @match https://redlib.freedit.eu/*
// @match https://redlib.frontendfriendly.xyz/*
// @match https://redlib.incogniweb.net/*
// @match https://redlib.nadeko.net/*
// @match https://redlib.nirn.quest/*
// @match https://redlib.nohost.network/*
// @match https://redlib.privacy.com.de/*
// @match https://redlib.privacyredirect.com/*
// @match https://redlib.private.coffee/*
// @match https://redlib.reallyaweso.me/*
// @match https://redlib.seasi.dev/*
// @match https://redlib.tux.pizza/*
// @match https://redlib.vimmer.dev/*
// @match https://rl.bloat.cat/*
// @match https://rl.rootdo.com/*
// @match https://redlib.perennialte.ch/*
// @match https://lr.quitaxd.online/*
// @match https://redlib.4o1x5.dev/*
// @match https://redlib.nezumi.party/*
// @match https://redlib.kittywi.re/*
// @match https://reddit.idevicehacked.com/*
// @match https://redlib.privacy.deals/*
// @match https://reddit.owo.si/*
// @match https://redlib.dnfetheus.xyz/*
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

// @match https://geoblock.ste.company/restricted/*

// ==/UserScript==

let shouldReloadWithNewPreferences = false
let preferencesString = ""

function setPreference(name, val) {
    preferencesString += `&${name}=${val}`
    shouldReloadWithNewPreferences = true
}

function tryNewInstance(suffix){
    location.replace('https://farside.link/redlib/' + suffix ?? (window.location.pathname + window.location.search));
}

function setCookie(name, val) {
    const expiry = new Date()
    expiry.setMonth(expiry.getMonth() + 1)
    const domainAssociation = "domain=" + window.location.hostname;
    document.cookie = `${name}=${val};${domainAssociation};expires=${expiry.toUTCString()}`;
}
   
function getCookie(name) {
    const nameInfo = name + "=";
    const cookieList = document.cookie.split(';');
    return cookieList.find(c => c.trim().startsWith(nameInfo))
}

function fixNSFWGate() {
    const nsfwElement = document.getElementById("nsfw_landing")
    if (!nsfwElement) return;
    const nsfwInfo = nsfwElement.querySelector("p")?.innerHTML
    if (!nsfwInfo) return
    
    if (nsfwInfo.includes("SFW-only")){
        const addedMessage = document.createElement("p")
        addedMessage.textContent = "Redirecting you to new instance..."
        nsfwElement.appendChild(addedMessage)
        tryNewInstance()
    }else{
        setPreference("show_nsfw", "on")
    }
}

// In case the server doesn't actually serve a proper page, for any reason.
// Since some might just have something like captcha pages (which are fine), we'll
// only do this for some known problematic instances
function fixInvalidPage(){
    if (["reddit.invak.id", "reddit.simo.sh"].includes(window.location.hostname)){
        const description = document.querySelector('meta[name="description"]')?.content
        if (!description || 
            typeof description != "string" || 
            !["libreddit", "redlib"].some(x => description.toLowerCase().includes(x))){
            tryNewInstance()
        }
    }
}


function fixDefaultCommentOrder(){
    if (["lr.artemislena.eu"].includes(window.location.hostname)){
        const COOKIE_NAME = window.location.hostname + "FIXED_COMMENT_ORDER"
        if (!getCookie(COOKIE_NAME)){
            setCookie(COOKIE_NAME, "yes")
            setPreference("comment_sort", "confidence")
        }
    }
}

function fixNoHls() {
    const notifications = document.getElementsByClassName("post_notification")
    for (const notification of notifications){
        const notifMessage = notification.querySelector("a")?.textContent
        if (notifMessage.trim() === "Enable HLS"){
            setPreference("use_hls", "on")
            break
        }
    }
}

function fixGeoFencing() {
    if (window.location.hostname == "geoblock.ste.company" && window.location.search.includes("reddit")) {
        const redirect = new URL(location.href).searchParams.get('path')
        tryNewInstance(redirect)
    }
}

fixInvalidPage()
fixGeoFencing() 
fixDefaultCommentOrder()
fixNSFWGate()
fixNoHls()

if (shouldReloadWithNewPreferences){
    // We might as well turn on HLS before we realize that it's not enabled and we 
    // have to reload a second time...
    setPreference("use_hls", "on")
    location.replace(`https://${window.location.hostname}/settings/update?${preferencesString}&redirect=${encodeURI(window.location.pathname.slice(1) + window.location.search)}`)
}