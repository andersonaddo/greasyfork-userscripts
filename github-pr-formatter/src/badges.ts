import { PRSummary } from "."
import { completedIconString, inboxIconString, noticeIconString, yoursIconString } from "./icons"
import { getStoredValue, storageKeys } from "./storage"

interface IconInfo{
    text: string,
    iconString: string,
    className: string,
}

export const getBadgeHolder = () => {
    const holder = document.createElement("div")
    holder.classList.add("badgeHolder")
    return holder
}

const makeBadge = (icon: IconInfo, href: string) => {
    const badge = document.createElement("div")
    badge.classList.add("badge")
    badge.classList.add(icon.className)

    const text = document.createElement("p")
    text.classList.add("badgeText")
    text.innerText = icon.text

    const iconHolder = document.createElement("div")
    iconHolder.classList.add("iconHolder")

    const template = document.createElement('template');
    template.innerHTML = icon.iconString;
    iconHolder.appendChild(template.content.firstChild as Element)

    badge.appendChild(iconHolder)
    badge.appendChild(text)

    const badgeLinkHolder = document.createElement("a")
    badgeLinkHolder.href = href
    badgeLinkHolder.appendChild(badge)

    return badgeLinkHolder
}

export const getPendingPrimaryBadge = (href: string) => makeBadge({
    className: "yellow",
    iconString: inboxIconString,
    text: "Pending - Primary"
}, href)

export const getPendingSecondaryBadge = (href: string) => makeBadge({
    className: "yellow",
    iconString: inboxIconString,
    text: "Pending - Secondary"
}, href)

export const getByYouBadge = (href: string) => makeBadge({
    className: "hollow",
    iconString: yoursIconString,
    text: "Yours"
}, href)

export const getYouApprovedBadge = (href: string) => makeBadge({
    className: "hollow",
    iconString: completedIconString,
    text: "You Approved"
}, href)

export const getYouRequestedChanges = (href: string) => makeBadge({
    className: "hollow",
    iconString: completedIconString,
    text: "You Requested Changes"
}, href)

export const getSomeoneRequestedChanges = (href: string) => makeBadge({
    className: "red",
    iconString: noticeIconString,
    text: "Changes Requested"
}, href)

export const getNoPrimaryBadge = (href: string) => makeBadge({
    className: "red",
    iconString: noticeIconString,
    text: "No Primary"
}, href)


export const getBaseBranchAnnotation = (prInfo: PRSummary) => {
    const baseRef = document.createElement("a")
    baseRef.classList.add("lh-default", "d-block", "d-md-inline")
    baseRef.style.color = "grey"
    if (prInfo.baseBranch?.prNumber){
        baseRef.textContent = `(#${prInfo.baseBranch?.prNumber}) ` + baseRef.textContent
        const url = prInfo.baseBranch?.prUrl || ""
        baseRef.href = url
        baseRef.setAttribute("data-hovercard-type", "pull_request")
        baseRef.setAttribute("data-hovercard-url", url.replace("https://github.com", "") + "/hovercard")
        baseRef.setAttribute("data-turbo-frame", "repo-content-turbo-frame")
    }
    
    if (prInfo.byUser){
        if (getStoredValue(storageKeys.USE_BASE_REF_PR_NAME)){
            baseRef.textContent += `[${truncate(prInfo.baseBranch?.prName ?? "", 18)}] <- `
        }else{
            const cleanedBase = prInfo.baseBranch?.name?.split("/").pop() //In my company, branches are formatted as <username>/<branch_name>
            baseRef.textContent += `[${truncate(cleanedBase ?? "", 18)}] <- `
        }
    }else{
        baseRef.textContent += `[not master] <- `
    }

    return baseRef
}

const truncate = (str: string, length: number) => str.length > length ? `${str.substring(0, length)}...` : str;

export const getFailedCIBadge = (href: string, CIName: string) => makeBadge({
    className: "red",
    iconString: noticeIconString,
    text: truncate(CIName, 10)
}, href)
