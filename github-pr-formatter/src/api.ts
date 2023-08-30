import axios from "axios";

export interface User {
    name: string,
    login: string
}

export type PRReviewState = "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED" | "PENDING"
type PRState = "OPEN" | "MERGED" | "CLOSED"
export type OverallPRReviewStatus = "CHANGES_REQUESTED" | "APPROVED" | "REVIEW_REQUIRED" | null

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
    assignees: {
      nodes: User[]
    } 
    reviewRequests: { //Users leave this array once they make a review, I believe
        nodes: Array<{
            requestedReviewer: User
        }>
    },
    latestNonPendingReviews: {
        nodes: Array<{
            state: PRReviewState
            author: User
        }>
    }
}

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
      first: 10
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
