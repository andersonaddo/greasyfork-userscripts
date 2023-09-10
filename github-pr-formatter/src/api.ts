import axios from "axios";

export type PRReviewState = "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED" | "PENDING"
type PRState = "OPEN" | "MERGED" | "CLOSED"
export type OverallPRReviewStatus = "CHANGES_REQUESTED" | "APPROVED" | "REVIEW_REQUIRED" | null
type CIStatusOverall = "EXPECTED" | "ERROR" | "FAILURE" | "PENDING" | "SUCCESS"
type CIStatusIndividual = "ACTION_REQUIRED" | "TIMED_OUT" | "CANCELLED" | "FAILURE" | "SUCCESS" | "NEUTRAL" | "SKIPPED" | "STARTUP_FAILURE" | "STALE"


interface PRInfo {
  data: {
    rateLimit: {
      limit: number,
      remaining: number,
      used: number,
      cost: number
    },
    search: {
      nodes: Array<SingularPRInfo>
    }
  }
}

export interface SingularPRInfo {
  id: string,
  title: string,
  createdAt: string,
  number: number,
  isDraft: boolean,
  state: PRState,
  isReadByViewer: boolean,
  reviewDecision: OverallPRReviewStatus
  viewerLatestReview: PRReviewState,
  author: User
  baseRef: {
    name: string
    associatedPullRequests: {
      nodes: Array<{
        url: string
        number: number
        title: string
        repository: {
          name: string
          url: string
        }
      }>
    }
  }
  assignees: {
    nodes: User[]
  }
  reviewRequests: { //Users leave this array once they make a review, I believe
    nodes: Array<{
      requestedReviewer: User | null //can be null if requestedReviewer is a group or a bot or something
    }>
  },
  latestNonPendingReviews: {
    nodes: Array<{
      state: PRReviewState
      author: User
    }>
  }
  commits: {
    nodes: Array<Commit>
  }
}
export interface User {
  name: string,
  login: string
}
export interface Commit {
  commit: {
    statusCheckRollup?: {
      state: CIStatusOverall,
      contexts: {
        checkRunCount: number,
        edges: Array<CISummary>
      }
    }
  }
}

interface CISummary {
  node: {
    name?: string,
    conclusion?: CIStatusIndividual
  }
}

const makeGraphQLQuery = (repo: string) => `{
    rateLimit {
      limit
      remaining
      used
      cost
    }
    search(
      query: "is:open is:pr involves:@me archived:false repo:${repo}"
      type: ISSUE
      first: 30
    ) {
      nodes {
        ... on PullRequest {
          id
          title
          createdAt
          number
          isDraft
          state
          isReadByViewer
          reviewDecision
          author {
            ... on User {
              login
              name
            }
          }
          baseRef {
            name
            associatedPullRequests(orderBy: {field: CREATED_AT, direction: DESC}, first: 1) {
              nodes {
                url
                number
                title
                repository {
                  name
                  url
                }
              }
            }
          }
          assignees(first: 10) {
            nodes {
              login
              name
            }
          }
          reviewRequests(first: 10) {
            nodes {
              requestedReviewer {
                ... on User {
                  login
                  name
                }
              }
            }
          }
          viewerLatestReview {
            state
          }
          latestNonPendingReviews: latestReviews(first: 10) {
            nodes {
              state
              author {
                ... on User {
                  id
                  name
                  login
                }
              }
            }
          }
          commits(last: 1) {
            nodes {
              commit {
                statusCheckRollup {
                  state
                  contexts(first: 30) {
                    checkRunCount
                    edges {
                      node {
                        ... on CheckRun {
                          name
                          conclusion
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`


export const getPRInfo = async (repo: string, token: string) => {
  const axiosInstance = axios.create({
    baseURL: 'https://api.github.com/graphql',
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  let response = await axiosInstance.post('', {
    query: makeGraphQLQuery(repo)
  });

  return response.data as PRInfo
}
