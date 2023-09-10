import { Commit, OverallPRReviewStatus, PRReviewState, SingularPRInfo, User, getPRInfo } from "./api";
import {
  getBadgeHolder, getByYouBadge,
  getPendingPrimaryBadge, getPendingSecondaryBadge,
  getYouApprovedBadge, getYouRequestedChanges,
  getSomeoneRequestedChanges,
  getNoPrimaryBadge,
  getFailedCIBadge,
  getBaseBranchAnnotation
} from "./badges";
import { REPO_DEFAULT, TOKEN_DEFAULT, USERNAME_DEFAULT, getStoredValue, initializeStorage, openStoragePanel, storageKeys } from "./storage";

import "./style/main.css";
import { isPRList, utils } from "github-url-detection"

export interface PRSummary {
  unseenByUser?: boolean
  byUser?: boolean
  waitingPrimary?: boolean
  waitingSecondary?: boolean
  userHasGivenUpToDateReview?: boolean
  upToDateReview?: PRReviewState
  prState?: OverallPRReviewStatus
  requiresAttention?: boolean
  noPrimary?: boolean
  nonTrivialFailedCI?: string | undefined
  baseBranch?: {
    name: string
    prNumber: number | undefined
    prUrl: string | undefined
    prName: string | undefined
  }
}

initializeStorage(() => {
  if (getStoredValue(storageKeys.TOKEN) == TOKEN_DEFAULT ||
    getStoredValue(storageKeys.REPO) == REPO_DEFAULT ||
    getStoredValue(storageKeys.USERNAME) == USERNAME_DEFAULT) {
    openStoragePanel()
  } else {
    organizeRepos()
    document.addEventListener("soft-nav:end", organizeRepos);
    document.addEventListener("navigation:end", organizeRepos);
  }
})



async function organizeRepos() {
    if (!isPRList()) return
    if (!utils.getRepositoryInfo()?.nameWithOwner == getStoredValue(storageKeys.REPO)) return;

    const footer = document.querySelector("ul[aria-labelledby*=footer]")
    const settingsOpener = document.createElement("li")
    const settingsOpenerText = document.createElement("p")
    settingsOpenerText.innerText = "Open userscript settings"
    settingsOpener.appendChild(settingsOpenerText)
    settingsOpener.addEventListener("click", openStoragePanel)
    footer?.appendChild(settingsOpener)

    const repoInfo = await getPRInfo(getStoredValue(storageKeys.REPO), getStoredValue(storageKeys.TOKEN))
    console.log(`Remaining Github GraphQL Quota: ${repoInfo.data.rateLimit.remaining}/${repoInfo.data.rateLimit.limit}`)

    const PRListElements = document.querySelectorAll("div[id^='issue_']") //ids starting with "issue_"

    const requireAttention: Element[] = []
    const doesntRequireAttentionYours: Element[] = []
    const doesntRequireAttention: Element[] = []

    const ignoredCIs = (getStoredValue(storageKeys.IGNORED_GI) as string).trim().split(",").map(x => x.trim()).filter(x => x != "")

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
      summary.noPrimary = associatedPRInfo.assignees.nodes.length == 0;
      summary.nonTrivialFailedCI = associatedPRInfo.commits.nodes
        .map(x => extractFailingCIFromCommitInto(x, ignoredCIs))
        .find(x => x != undefined)?.node.name
      summary.baseBranch = {
        name: associatedPRInfo.baseRef.name,
        prNumber: associatedPRInfo.baseRef.associatedPullRequests.nodes.at(0)?.number,
        prUrl: associatedPRInfo.baseRef.associatedPullRequests.nodes.at(0)?.url,
        prName: associatedPRInfo.baseRef.associatedPullRequests.nodes.at(0)?.title
      }


      summary.requiresAttention = summary.waitingSecondary ||
        summary.waitingPrimary ||
        (summary.byUser && summary.prState == "CHANGES_REQUESTED") ||
        (summary.byUser && summary.noPrimary) ||
        (summary.byUser && summary.nonTrivialFailedCI != undefined)


      if (row.children.length < 1) return
      const rowContentHolder = row.children[0]
      const badgeHolder = getBadgeHolder()
      rowContentHolder.insertBefore(badgeHolder, clampedAt(rowContentHolder.children, 3))

      const href = row.querySelector("a[id^='issue_']")?.getAttribute("href") ?? ""

      if (summary.baseBranch.name != "master" && summary.baseBranch.name != "main") badgeHolder.appendChild(getBaseBranchAnnotation(summary))
      if (summary.byUser && summary.prState == "CHANGES_REQUESTED") badgeHolder.append(getSomeoneRequestedChanges(href))
      if (summary.byUser && summary.nonTrivialFailedCI) badgeHolder.append(getFailedCIBadge(href, summary.nonTrivialFailedCI))
      if (summary.noPrimary) badgeHolder.append(getNoPrimaryBadge(href))
      if (summary.waitingPrimary) badgeHolder.append(getPendingPrimaryBadge(href))
      if (summary.waitingSecondary) badgeHolder.append(getPendingSecondaryBadge(href))
      if (summary.upToDateReview == "APPROVED") badgeHolder.append(getYouApprovedBadge(href))
      if (summary.upToDateReview == "CHANGES_REQUESTED") badgeHolder.append(getYouRequestedChanges(href))
      if (summary.byUser) badgeHolder.append(getByYouBadge(href))

      row.remove()
      if (summary.requiresAttention) {
        requireAttention.push(row)
      } else if (summary.byUser) {
        doesntRequireAttentionYours.push(row)
      } else {
        doesntRequireAttention.push(row)
      }
    })

    doesntRequireAttention.reverse()
    doesntRequireAttentionYours.reverse()
    requireAttention.reverse()

    const attentionDivider = document.createElement("p")
    attentionDivider.innerText = "Requires Attention"
    attentionDivider.classList.add("divider")

    const nonAttentionYoursDivider = document.createElement("p")
    nonAttentionYoursDivider.style.marginTop = "24px"
    nonAttentionYoursDivider.innerText = "Other - Yours"
    nonAttentionYoursDivider.classList.add("divider")

    const nonAttentionDivider = document.createElement("p")
    nonAttentionDivider.style.marginTop = "24px"
    nonAttentionDivider.innerText = "Other - Misc"
    nonAttentionDivider.classList.add("divider")

    const containers = document.getElementsByClassName("js-active-navigation-container")
    if (containers.length == 0) return

    const PRListHolder = containers[0]

    if (requireAttention.length != 0) {
      PRListHolder.appendChild(attentionDivider)
      requireAttention.forEach(x => PRListHolder.appendChild(x))
    }

    if (doesntRequireAttentionYours.length != 0) {
      PRListHolder.appendChild(nonAttentionYoursDivider)
      doesntRequireAttentionYours.forEach(x => {
        x.classList.add("lowPriorityPR")
        PRListHolder.appendChild(x)
      })
    }

    if (doesntRequireAttention.length != 0) {
      PRListHolder.appendChild(nonAttentionDivider)
      doesntRequireAttention.forEach(x => {
        x.classList.add("lowPriorityPR")
        PRListHolder.appendChild(x)
      })
    }
}

function isCurrentUser(x: User | null) {
  return x != null && x.login == getStoredValue(storageKeys.USERNAME)
}

function clampedAt(arr: HTMLCollection, index: number) {
  return arr[Math.min(arr.length - 1, index)]
}

function extractFailingCIFromCommitInto(commit: Commit, substringWhitelist: string[]) {
  return commit.commit.statusCheckRollup?.contexts.edges
    .find(ci => ci.node.conclusion == "FAILURE" && !substringWhitelist.some(ciSubstring => ci.node.name?.includes(ciSubstring)))
}
