//Found it easier to just copy the js from the source into this project and reference from it
import { GM_config } from "./external/GM_Config";

export const TOKEN_DEFAULT = "<Token Here>"
export const USERNAME_DEFAULT = "<Username Here>"
export const REPO_DEFAULT = "<Repo Here>"
const IGNORED_CI_DEFAULT = ""
const USE_BASE_REF_PR_NAME_DEFAULT = true

export enum storageKeys {
    TOKEN = "token",
    REPO = "repo",
    USERNAME = "username",
    IGNORED_GI = "ignoredCI",
    USE_BASE_REF_PR_NAME = "useBaseRefPrName"
}

let user_pref = undefined as any

export const initializeStorage = (successCallback: () => void) => {
    user_pref = new GM_config({
        id: 'MyConfig',
        title: 'Script Settings (refresh page after saving; you can open this again by going to GitHub footer)',
        fields: {
            [storageKeys.TOKEN]:
            {
                label: 'Github Personal Access Token (only read-only necessary)',
                type: 'text',
                default: TOKEN_DEFAULT
            },
            [storageKeys.REPO]:
            {
                label: 'Repo name. Used for query: `is:open is:pr involves:@me archived:false repo:xxx`',
                type: 'text',
                default: REPO_DEFAULT
            },
            [storageKeys.USERNAME]:
            {
                label: 'Github Username',
                type: 'text',
                default: USERNAME_DEFAULT
            },
            [storageKeys.IGNORED_GI]: {
                label: '[Optional] CI test titles to ignore, comma separated',
                type: 'text',
                default: IGNORED_CI_DEFAULT
            },
            [storageKeys.USE_BASE_REF_PR_NAME]: {
                label: "[Optional] Refer to base branches using their associated PR's name",
                type: 'checkbox',
                default: USE_BASE_REF_PR_NAME_DEFAULT
            }
        },
        events: {
            init: successCallback
        }
    })
}

export const getStoredValue = (key: storageKeys) => user_pref.get(key)
export const openStoragePanel = () => user_pref.open()