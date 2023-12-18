// ==UserScript==
// @name         Libreddit Quirk Fixer
// @namespace    happyviking
// @version      1.0.0
// @grant        none
// @run-at       document-end
// @license      MIT
// @description  Fix some quirks of libreddit instances (disabled HLS, disabled NSFW, etc)
// @icon         https://gitlab.com/uploads/-/system/project/avatar/32545239/libreddit.png
// @author       HappyViking

// <<INSTANCES START HERE>>
// @match https://l.opnxng.com/*
// @match https://libreddit.bus-hit.me/*
// @match https://libreddit.freedit.eu/*
// @match https://libreddit.hu/*
// @match https://libreddit.kylrth.com/*
// @match https://libreddit.lunar.icu/*
// @match https://libreddit.mha.fi/*
// @match https://libreddit.northboot.xyz/*
// @match https://libreddit.oxymagnesium.com/*
// @match https://libreddit.privacydev.net/*
// @match https://libreddit.pussthecat.org/*
// @match https://libreddit.spike.codes/*
// @match https://libreddit.strongthany.cc/*
// @match https://libreddit.tiekoetter.com/*
// @match https://lr.4201337.xyz/*
// @match https://lr.aeong.one/*
// @match https://lr.artemislena.eu/*
// @match https://lr.slipfox.xyz/*
// @match https://r.walkx.fyi/*
// @match https://reddit.invak.id/*
// @match https://reddit.rtrace.io/*
// @match https://reddit.simo.sh/*
// @match https://reddit.smnz.de/*
// @match https://reddit.utsav2.dev/*
// @match https://safereddit.com/*
// @match https://snoo.habedieeh.re/*
// @match https://libreddit.kutay.dev/*
// @match https://libreddit.projectsegfau.lt/*
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

let shouldReloadWithNewPreferences = false
let preferencesString = ""

function setPreference(name, val) {
    preferencesString += `&${name}=${val}`
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
        location.replace('https://farside.link/libreddit/' + window.location.pathname + window.location.search);
    }else{
        setPreference("show_nsfw", "on")
        shouldReloadWithNewPreferences = true
    }
}

function fixNoHls() {
    const notifications = document.getElementsByClassName("post_notification")
    for (const notification of notifications){
        const notifMessage = notification.querySelector("a")?.textContent
        if (notifMessage.trim() === "Enable HLS"){
            setPreference("use_hls", "on")
            shouldReloadWithNewPreferences = true
            break
        }
    }
}

fixNSFWGate()
fixNoHls()

if (shouldReloadWithNewPreferences){
    // We might as well turn on HLS before we realize that it's not enabled and we 
    // have to reload a second time...
    setPreference("use_hls", "on")
    location.replace(`https://${window.location.hostname}/settings/update?${preferencesString}&redirect=${decodeURI(window.location.pathname.slice(1) + window.location.search)}`)
}


