// ==UserScript==
// @name     Sentry to Datadog RUM and Log buttons
// @version  2
// @grant    none
// @match    https://*.sentry.io/issues/*
// @license  MIT
// @namespace happyviking
// @description Read the README
// ==/UserScript==

//https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

const main = async () => {

    const info = {}

    //ID
    await waitForElm('div[data-test-id="event-tags"]') //Just waiting till it loads
    const ID = document.querySelector('td[data-test-id="user-context-id-value"]')?.querySelector(".val-string > span")?.textContent
    info.id = ID

    //RUM
    const RUMTable = document.querySelector('div[data-test-id="event-section-context-datadog"]')?.nextElementSibling
    if (RUMTable){
        //https://stackoverflow.com/questions/37098405/javascript-queryselector-find-div-by-innertext
        const tableKey = document.evaluate('//td[text()="RUM"]', RUMTable, null, XPathResult.ANY_TYPE, null).iterateNext()
        const RUM = tableKey?.nextSibling?.querySelector(".val-string > span")?.textContent
        info.RUM = RUM
    }


    //Timestamp
    const time = document.querySelector("time")?.textContent
    info.time = time

    const buttonHolder = document.createElement("div")
    buttonHolder.id = "thebuttonholder"
    const parent = document.querySelector("header")?.parentElement
    if (!parent) return

    if (!document.getElementById("thebuttonholder")) parent.insertBefore(buttonHolder, document.querySelector('div[role=tabpanel]'))

    if (!document.getElementById("rum-shortcut")){
        if (info.RUM){
            buttonHolder.appendChild(makeButton("Provided RUM","rum-shortcut", info.RUM))
        }else{
            const text = document.createElement("p")
            text.textContent = "NO PROVIDED RUM 🥲"
            text.style.color = "red"
            text.style.fontSize = "18px"
            text.id = "rum-shortcut"
            buttonHolder.appendChild(text)
        }
    }


    if (info.time && info.id && !document.getElementById("manual-rum-shortcut")){
        //Adding more info to the date so that the resultant date object is accurate
        info.time += ` ${(new Date()).getFullYear()} UTC`
        const eventTime = new Date(Date.parse(info.time)).getTime()
        const OFFSET = 300000 //5 minutes in milliseconfs
        const OFFSET_SHORTER = 60000 //1 minutes in milliseconfs
        const OFFSET_FOR_HIGHLIGHTING = 30000 //30 seconds in milliseconfs

        //Adding inferred RUM button
        const manualRumURL = new URL("https://app.datadoghq.com/rum/sessions?query=%40type%3Aerror&cols=&tab=session&viz=stream&live=false")
        manualRumURL.searchParams.set("query", (manualRumURL.searchParams.get("query") || "") + ` @usr.id:${info.id}`)
        manualRumURL.searchParams.set("from_ts", eventTime - OFFSET )
        manualRumURL.searchParams.set("to_ts", eventTime + OFFSET)
        //For my "Datadog RUM log highlighting" script
        manualRumURL.searchParams.set("highlight_from", eventTime - OFFSET_FOR_HIGHLIGHTING )
        manualRumURL.searchParams.set("highlight_to", eventTime + OFFSET_FOR_HIGHLIGHTING)
        buttonHolder.appendChild(makeButton("Inferred RUM","manual-rum-shortcut", manualRumURL.toString()))

        //Adding Logs button
        const logsUrl = new URL("https://app.datadoghq.com/logs?cols=host%2Cservice%2C%40accountName%2C%40args.url&index=&messageDisplay=inline&refresh_mode=sliding&stream_sort=time%2Cdesc&viz=stream&live=false")
        logsUrl.searchParams.set("query", `@usr.id:${info.id}`)
        logsUrl.searchParams.set("from_ts", eventTime - OFFSET_SHORTER )
        logsUrl.searchParams.set("to_ts", eventTime + OFFSET_SHORTER)
        //For my "Datadog Log log highlighting" script
        logsUrl.searchParams.set("highlight_from", eventTime - OFFSET_FOR_HIGHLIGHTING )
        logsUrl.searchParams.set("highlight_to", eventTime + OFFSET_FOR_HIGHLIGHTING)
        buttonHolder.appendChild(makeButton("Relevant Logs","logs-shortcut", logsUrl.toString()))
    }
}


const makeButton = (text, id, href) => {
    const button = document.createElement("button")
    button.textContent = text
    const link = document.createElement("a")
    link.appendChild(button)
    link.href = href
    link.target="_blank"
    link.id = id
    button.className = document.querySelector('button[aria-label="Resolve"]')?.className ?? ""
    return link
}


//There are probably cleaner ways to do this but I don't really care, this works and this
//is supposed to be fast

let currentPage = location.href;
main()
setInterval(() =>
{
    if (currentPage != location.href){
        currentPage = location.href;
        main()
    }
}, 500);
