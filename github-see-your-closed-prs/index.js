// ==UserScript==
// @name          Github See Your Closed PRs
// @namespace     happyviking
// @version       1.0.0
// @description   See PRs you created that are merged or closed
// @author        HappyViking
// @match         https://github.com/*/pulls*
// @exclude       https://github.com/*/pulls/*
// @run-at        document-end
// @license       MIT
// ==/UserScript==

const USERNAME = "<Change_username_here>"

const main = () => {
    const toolbar = document.getElementById("js-issues-toolbar")
    console.log(toolbar)
    if (!toolbar) return
    const query = toolbar.getElementsByClassName("table-list-header-toggle");
    console.log(query)
    if (query.length == 0) return
    const buttonParent = query[0]

    const button = document.createElement("a")
    button.classList.add("btn-link")
    button.textContent = "Closed (yours)"
    button.href = encodeURI("https://"
        + window.location.hostname
        + window.location.pathname
        + `?q=is:pr+is:closed+author:${USERNAME}`)
    buttonParent.append(button)
}

main()
