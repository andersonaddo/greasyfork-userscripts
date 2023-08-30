import { OverallPRReviewStatus, PRReviewState, SingularPRInfo, User, getPRInfo } from "./api";
import {
  getBadgeHolder, getByYouBadge,
  getPendingPrimaryBadge, getPendingSecondaryBadge,
  getYouApprovedBadge, getYouRequestedChanges,
  getSomeoneRequestedChanges
} from "./badges";
//Found it easier to just copy the js from the source into this project and reference from it
import { GM_config } from "./external/GM_Config";
import "./style/main.css";

interface PRSummary {
  unseenByUser?: boolean
  byUser?: boolean
  waitingPrimary?: boolean
  waitingSecondary?: boolean
  userHasGivenUpToDateReview?: boolean
  upToDateReview?: PRReviewState
  prState?: OverallPRReviewStatus
  requiresAttention?: boolean
}

const TOKEN_DEFAULT = "<Token Here>"
const USERNAME_DEFAULT = "<Username Here>"
const REPO_DEFAULT = "<Repo Here>"

let user_pref = new GM_config({
  id: 'MyConfig',
  title: 'Script Settings (refresh page after saving)',
  fields: {
    token:
    {
      label: 'Github Personal Access Token',
      type: 'text',
      default: TOKEN_DEFAULT
    },
    repo:
    {
      label: 'Repo name',
      type: 'text',
      default: REPO_DEFAULT
    },
    username:
    {
      label: 'Github Username',
      type: 'text',
      default: USERNAME_DEFAULT
    }
  },
  events: {
    init: () => {
      if (user_pref.get("token") == TOKEN_DEFAULT ||
        user_pref.get("repo") == REPO_DEFAULT ||
        user_pref.get("username") == USERNAME_DEFAULT) {
        user_pref.open()
      } else {
        main().catch((e) => {
          console.error(e);
        });
      }

    }
  }
}) as any;


async function main() {

  const footer = document.querySelector("ul[aria-labelledby*=footer]")
  const settingsOpener = document.createElement("li")
  const settingsOpenerText = document.createElement("p")
  settingsOpenerText.innerText = "Open userscript settings"
  settingsOpener.appendChild(settingsOpenerText)
  footer.appendChild(settingsOpener)
  settingsOpener.addEventListener("click", () => user_pref.open())

  const repoInfo = await getPRInfo(user_pref.get("repo"), user_pref.get("token"))
  const PRListElements = document.querySelectorAll("div[id^='issue_']") //ids starting with "issue_"

  const requireAttention: Element[] = []
  const doesntRequireAttention: Element[] = []

  PRListElements.forEach(row => {
    const rowId = row.id.replace("issue_", "")
    const associatedPRInfo = repoInfo.data.search.nodes.find(x => x.number.toString() == rowId) as (SingularPRInfo | undefined)
    if (!associatedPRInfo) return
    const summary: PRSummary = {}
    const latestReviewInfo = associatedPRInfo.latestNonPendingReviews.nodes.find(x => isCurrentUser(x.author))?.state as (PRReviewState | undefined)
    summary.byUser = isCurrentUser(associatedPRInfo.author)
    summary.prState = associatedPRInfo.reviewDecision
    summary.userHasGivenUpToDateReview = !!latestReviewInfo
    summary.waitingPrimary = associatedPRInfo.assignees.nodes.some(isCurrentUser) && !latestReviewInfo
    summary.waitingSecondary = associatedPRInfo.reviewRequests.nodes.some(x => isCurrentUser(x.requestedReviewer))
    summary.upToDateReview = latestReviewInfo
    summary.unseenByUser = associatedPRInfo.isReadByViewer
    summary.requiresAttention = summary.waitingSecondary || summary.waitingPrimary || (summary.byUser && summary.prState == "CHANGES_REQUESTED")


    if (row.children.length < 1) return
    const rowContentHolder = row.children[0]
    const badgeHolder = getBadgeHolder()
    rowContentHolder.insertBefore(badgeHolder, clampedAt(rowContentHolder.children, 3))

    const href = row.querySelector("a[id^='issue_']")?.getAttribute("href") ?? ""

    if (summary.byUser && summary.prState == "CHANGES_REQUESTED") badgeHolder.append(getSomeoneRequestedChanges(href))
    if (summary.waitingPrimary) badgeHolder.append(getPendingPrimaryBadge(href))
    if (summary.waitingSecondary) badgeHolder.append(getPendingSecondaryBadge(href))
    if (summary.upToDateReview == "APPROVED") badgeHolder.append(getYouApprovedBadge(href))
    if (summary.upToDateReview == "CHANGES_REQUESTED") badgeHolder.append(getYouRequestedChanges(href))
    if (summary.byUser) badgeHolder.append(getByYouBadge(href))

    row.remove()
    if (summary.requiresAttention) {
      requireAttention.push(row)
    } else {
      doesntRequireAttention.push(row)
    }
  })

  doesntRequireAttention.reverse()
  requireAttention.reverse()

  const attentionDivider = document.createElement("p")
  attentionDivider.innerText = "Requires Attention"
  attentionDivider.classList.add("divider")

  const nonAttentionDivider = document.createElement("p")
  nonAttentionDivider.innerText = "Other"
  nonAttentionDivider.classList.add("divider")
  nonAttentionDivider.style.marginTop = "24px"

  const containers = document.getElementsByClassName("js-active-navigation-container")
  if (containers.length == 0) return

  const PRListHolder = containers[0]

  if (requireAttention.length != 0) {
    PRListHolder.appendChild(attentionDivider)
    requireAttention.forEach(x => PRListHolder.appendChild(x))
  }
  if (doesntRequireAttention.length != 0) {
    PRListHolder.appendChild(nonAttentionDivider)
    doesntRequireAttention.forEach(x => {
      x.classList.add("lowPriorityPR")
      PRListHolder.appendChild(x)
    })
  }
}

function isCurrentUser(x: User) {
  return x.login == user_pref.get("username")
}

function clampedAt(arr: HTMLCollection, index: number) {
  return arr[Math.min(arr.length - 1, index)]
}
