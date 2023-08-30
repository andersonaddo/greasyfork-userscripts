import { completedIconString, inboxIconString, noticeIconString, yoursIconString } from "./icons"

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
    iconHolder.appendChild(template.content.firstChild)

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