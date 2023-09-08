var githubUrlDetection = (function (exports) {
    'use strict';
  
    const reservedNames = [
      "400",
      "401",
      "402",
      "403",
      "404",
      "405",
      "406",
      "407",
      "408",
      "409",
      "410",
      "411",
      "412",
      "413",
      "414",
      "415",
      "416",
      "417",
      "418",
      "419",
      "420",
      "421",
      "422",
      "423",
      "424",
      "425",
      "426",
      "427",
      "428",
      "429",
      "430",
      "431",
      "500",
      "501",
      "502",
      "503",
      "504",
      "505",
      "506",
      "507",
      "508",
      "509",
      "510",
      "511",
      "about",
      "access",
      "account",
      "admin",
      "advisories",
      "anonymous",
      "any",
      "api",
      "apps",
      "attributes",
      "auth",
      "billing",
      "blob",
      "blog",
      "bounty",
      "branches",
      "business",
      "businesses",
      "c",
      "cache",
      "case-studies",
      "categories",
      "central",
      "certification",
      "changelog",
      "cla",
      "cloud",
      "codereview",
      "collection",
      "collections",
      "comments",
      "commit",
      "commits",
      "community",
      "companies",
      "compare",
      "contact",
      "contributing",
      "cookbook",
      "coupons",
      "customer-stories",
      "customer",
      "customers",
      "dashboard",
      "dashboards",
      "design",
      "develop",
      "developer",
      "diff",
      "discover",
      "discussions",
      "docs",
      "downloads",
      "downtime",
      "editor",
      "editors",
      "edu",
      "enterprise",
      "events",
      "explore",
      "featured",
      "features",
      "files",
      "fixtures",
      "forked",
      "garage",
      "ghost",
      "gist",
      "gists",
      "graphs",
      "guide",
      "guides",
      "help",
      "help-wanted",
      "home",
      "hooks",
      "hosting",
      "hovercards",
      "identity",
      "images",
      "inbox",
      "individual",
      "info",
      "integration",
      "interfaces",
      "introduction",
      "invalid-email-address",
      "investors",
      "issues",
      "jobs",
      "join",
      "journal",
      "journals",
      "lab",
      "labs",
      "languages",
      "launch",
      "layouts",
      "learn",
      "legal",
      "library",
      "linux",
      "listings",
      "lists",
      "login",
      "logos",
      "logout",
      "mac",
      "maintenance",
      "malware",
      "man",
      "marketplace",
      "mention",
      "mentioned",
      "mentioning",
      "mentions",
      "migrating",
      "milestones",
      "mine",
      "mirrors",
      "mobile",
      "navigation",
      "network",
      "new",
      "news",
      "none",
      "nonprofit",
      "nonprofits",
      "notices",
      "notifications",
      "oauth",
      "offer",
      "open-source",
      "organisations",
      "organizations",
      "orgs",
      "pages",
      "partners",
      "payments",
      "personal",
      "plans",
      "plugins",
      "popular",
      "popularity",
      "posts",
      "press",
      "pricing",
      "professional",
      "projects",
      "pulls",
      "raw",
      "readme",
      "recommendations",
      "redeem",
      "releases",
      "render",
      "reply",
      "repositories",
      "resources",
      "restore",
      "revert",
      "save-net-neutrality",
      "saved",
      "scraping",
      "search",
      "security",
      "services",
      "sessions",
      "settings",
      "shareholders",
      "shop",
      "showcases",
      "signin",
      "signup",
      "site",
      "spam",
      "sponsors",
      "ssh",
      "staff",
      "starred",
      "stars",
      "static",
      "status",
      "statuses",
      "storage",
      "store",
      "stories",
      "styleguide",
      "subscriptions",
      "suggest",
      "suggestion",
      "suggestions",
      "support",
      "suspended",
      "talks",
      "teach",
      "teacher",
      "teachers",
      "teaching",
      "team",
      "teams",
      "ten",
      "terms",
      "timeline",
      "topic",
      "topics",
      "tos",
      "tour",
      "train",
      "training",
      "translations",
      "tree",
      "trending",
      "updates",
      "username",
      "users",
      "visualization",
      "w",
      "watching",
      "wiki",
      "windows",
      "works-with",
      "www0",
      "www1",
      "www2",
      "www3",
      "www4",
      "www5",
      "www6",
      "www7",
      "www8",
      "www9"
    ];
    const $ = (selector) => document.querySelector(selector);
    const exists = (selector) => Boolean($(selector));
    const is404 = () => /^(Page|File) not found · GitHub/.test(document.title);
    const is500 = () => document.title === "Server Error · GitHub" || document.title === "Unicorn! · GitHub" || document.title === "504 Gateway Time-out";
    const isPasswordConfirmation = () => document.title === "Confirm password" || document.title === "Confirm access";
    const isBlame = (url = location) => Boolean(getRepo(url)?.path.startsWith("blame/"));
    const isCommit = (url = location) => isSingleCommit(url) || isPRCommit(url);
    const isCommitList = (url = location) => isRepoCommitList(url) || isPRCommitList(url);
    const isRepoCommitList = (url = location) => Boolean(getRepo(url)?.path.startsWith("commits"));
    const isCompare = (url = location) => Boolean(getRepo(url)?.path.startsWith("compare"));
    const isCompareWikiPage = (url = location) => isRepoWiki(url) && getCleanPathname(url).split("/").slice(3, 5).includes("_compare");
    const isDashboard = (url = location) => !isGist(url) && /^$|^(orgs\/[^/]+\/)?dashboard(\/|$)/.test(getCleanPathname(url));
    const isEnterprise = (url = location) => url.hostname !== "github.com" && url.hostname !== "gist.github.com";
    const isGist = (url = location) => typeof getCleanGistPathname(url) === "string";
    const isGlobalIssueOrPRList = (url = location) => ["issues", "pulls"].includes(url.pathname.split("/", 2)[1]);
    const isGlobalSearchResults = (url = location) => url.pathname === "/search" && new URLSearchParams(url.search).get("q") !== null;
    const isIssue = (url = location) => /^issues\/\d+/.test(getRepo(url)?.path) && document.title !== "GitHub · Where software is built";
    const isIssueOrPRList = (url = location) => isGlobalIssueOrPRList(url) || isRepoIssueOrPRList(url) || isMilestone(url);
    const isConversation = (url = location) => isIssue(url) || isPRConversation(url);
    const isLabelList = (url = location) => getRepo(url)?.path === "labels";
    const isMilestone = (url = location) => /^milestone\/\d+/.test(getRepo(url)?.path);
    const isMilestoneList = (url = location) => getRepo(url)?.path === "milestones";
    const isNewFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("new"));
    const isNewIssue = (url = location) => getRepo(url)?.path === "issues/new";
    const isNewRelease = (url = location) => getRepo(url)?.path === "releases/new";
    const isNewWikiPage = (url = location) => isRepoWiki(url) && getCleanPathname(url).endsWith("/_new");
    const isNotifications = (url = location) => getCleanPathname(url) === "notifications";
    const isOrganizationProfile = () => exists('meta[name="hovercard-subject-tag"][content^="organization"]');
    const isOrganizationRepo = () => exists('.AppHeader-context-full [data-hovercard-type="organization"]');
    const isTeamDiscussion = (url = location) => Boolean(getOrg(url)?.path.startsWith("teams"));
    const isOwnUserProfile = () => getCleanPathname() === getUsername();
    const isOwnOrganizationProfile = () => isOrganizationProfile() && !exists('[href*="contact/report-abuse?report="]');
    const isProject = (url = location) => /^projects\/\d+/.test(getRepo(url)?.path);
    const isProjects = (url = location) => getRepo(url)?.path === "projects";
    const isDiscussion = (url = location) => /^discussions\/\d+/.test(getRepo(url)?.path ?? getOrg(url)?.path);
    const isNewDiscussion = (url = location) => getRepo(url)?.path === "discussions/new" || getOrg(url)?.path === "discussions/new";
    const isDiscussionList = (url = location) => getRepo(url)?.path === "discussions" || getOrg(url)?.path === "discussions";
    const isPR = (url = location) => /^pull\/\d+/.test(getRepo(url)?.path) && !isPRConflicts(url);
    const isPRConflicts = (url = location) => /^pull\/\d+\/conflicts/.test(getRepo(url)?.path);
    const isPRList = (url = location) => url.pathname === "/pulls" || getRepo(url)?.path === "pulls";
    const isPRCommit = (url = location) => /^pull\/\d+\/commits\/[\da-f]{5,40}$/.test(getRepo(url)?.path);
    const isPRCommit404 = () => isPRCommit() && document.title.startsWith("Commit range not found · Pull Request");
    const isPRFile404 = () => isPRFiles() && document.title.startsWith("Commit range not found · Pull Request");
    const isPRConversation = (url = location) => /^pull\/\d+$/.test(getRepo(url)?.path);
    const isPRCommitList = (url = location) => /^pull\/\d+\/commits$/.test(getRepo(url)?.path);
    const isPRFiles = (url = location) => /^pull\/\d+\/files/.test(getRepo(url)?.path) || isPRCommit(url);
    const isQuickPR = (url = location) => isCompare(url) && /[?&]quick_pull=1(&|$)/.test(url.search);
    const isDraftPR = () => exists("#partial-discussion-header .octicon-git-pull-request-draft");
    const isOpenPR = () => exists("#partial-discussion-header :is(.octicon-git-pull-request, .octicon-git-pull-request-draft)");
    const isMergedPR = () => exists("#partial-discussion-header .octicon-git-merge");
    const isClosedPR = () => exists("#partial-discussion-header :is(.octicon-git-pull-request-closed, .octicon-git-merge)");
    const isClosedIssue = () => exists("#partial-discussion-header :is(.octicon-issue-closed, .octicon-skip)");
    const isReleases = (url = location) => getRepo(url)?.path === "releases";
    const isTags = (url = location) => getRepo(url)?.path === "tags";
    const isSingleReleaseOrTag = (url = location) => Boolean(getRepo(url)?.path.startsWith("releases/tag"));
    const isReleasesOrTags = (url = location) => isReleases(url) || isTags(url);
    const isDeletingFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("delete"));
    const isEditingFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("edit"));
    const hasFileEditor = (url = location) => isEditingFile(url) || isNewFile(url) || isDeletingFile(url);
    const isEditingRelease = (url = location) => Boolean(getRepo(url)?.path.startsWith("releases/edit"));
    const hasReleaseEditor = (url = location) => isEditingRelease(url) || isNewRelease(url);
    const isEditingWikiPage = (url = location) => isRepoWiki(url) && getCleanPathname(url).endsWith("/_edit");
    const hasWikiPageEditor = (url = location) => isEditingWikiPage(url) || isNewWikiPage(url);
    const isRepo = (url = location) => /^[^/]+\/[^/]+/.test(getCleanPathname(url)) && !reservedNames.includes(url.pathname.split("/", 2)[1]) && !isDashboard(url) && !isGist(url) && !isNewRepoTemplate(url);
    const hasRepoHeader = (url = location) => isRepo(url) && !isRepoSearch(url);
    const isEmptyRepoRoot = () => isRepoHome() && !exists('link[rel="canonical"]');
    const isEmptyRepo = () => exists('[aria-label="Cannot fork because repository is empty."]');
    const isPublicRepo = () => exists('meta[name="octolytics-dimension-repository_public"][content="true"]');
    const isArchivedRepo = () => Boolean(isRepo() && $("main > .flash-warn")?.textContent.includes("archived"));
    const isBlank = () => exists("main .blankslate:not([hidden] .blankslate)");
    const isRepoTaxonomyIssueOrPRList = (url = location) => /^labels\/.+|^milestones\/\d+(?!\/edit)/.test(getRepo(url)?.path);
    const isRepoIssueOrPRList = (url = location) => isRepoPRList(url) || isRepoIssueList(url) || isRepoTaxonomyIssueOrPRList(url);
    const isRepoPRList = (url = location) => Boolean(getRepo(url)?.path.startsWith("pulls"));
    const isRepoIssueList = (url = location) => (
      /^labels\/|^issues(?!\/(\d+|new|templates)($|\/))/.test(getRepo(url)?.path)
    );
    const hasSearchParameter = (url) => new URLSearchParams(url.search).get("search") === "1";
    const isRepoHome = (url = location) => getRepo(url)?.path === "" && !hasSearchParameter(url);
    const _isRepoRoot = (url) => {
      const repository = getRepo(url ?? location);
      if (!repository) {
        return false;
      }
      if (!repository.path) {
        return true;
      }
      if (url) {
        return /^tree\/[^/]+$/.test(repository.path);
      }
      return repository.path.startsWith("tree/") && document.title.startsWith(repository.nameWithOwner) && !document.title.endsWith(repository.nameWithOwner);
    };
    const isRepoRoot = (url) => !hasSearchParameter(url ?? location) && _isRepoRoot(url);
    const isRepoSearch = (url = location) => getRepo(url)?.path === "search";
    const isRepoSettings = (url = location) => Boolean(getRepo(url)?.path.startsWith("settings"));
    const isRepoMainSettings = (url = location) => getRepo(url)?.path === "settings";
    const isRepliesSettings = (url = location) => url.pathname.startsWith("/settings/replies");
    const isUserSettings = (url = location) => url.pathname.startsWith("/settings/");
    const isRepoTree = (url = location) => _isRepoRoot(url) || Boolean(getRepo(url)?.path.startsWith("tree/"));
    const isRepoWiki = (url = location) => Boolean(getRepo(url)?.path.startsWith("wiki"));
    const isSingleCommit = (url = location) => /^commit\/[\da-f]{5,40}$/.test(getRepo(url)?.path);
    const isSingleFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("blob/"));
    const isFileFinder = (url = location) => Boolean(getRepo(url)?.path.startsWith("find/"));
    const isRepoFile404 = (url = location) => (isSingleFile(url) || isRepoTree(url)) && document.title.startsWith("File not found");
    const isRepoForksList = (url = location) => getRepo(url)?.path === "network/members";
    const isRepoNetworkGraph = (url = location) => getRepo(url)?.path === "network";
    const isForkedRepo = () => exists('meta[name="octolytics-dimension-repository_is_fork"][content="true"]');
    const isSingleGist = (url = location) => /^[^/]+\/[\da-f]{20,32}(\/[\da-f]{40})?$/.test(getCleanGistPathname(url));
    const isGistRevision = (url = location) => /^[^/]+\/[\da-f]{20,32}\/revisions$/.test(getCleanGistPathname(url));
    const isTrending = (url = location) => url.pathname === "/trending" || url.pathname.startsWith("/trending/");
    const isBranches = (url = location) => Boolean(getRepo(url)?.path.startsWith("branches"));
    const doesLookLikeAProfile = (string) => typeof string === "string" && string.length > 0 && !string.includes("/") && !string.includes(".") && !reservedNames.includes(string);
    const isProfile = (url = location) => !isGist(url) && doesLookLikeAProfile(getCleanPathname(url));
    const isGistProfile = (url = location) => doesLookLikeAProfile(getCleanGistPathname(url));
    const isUserProfile = () => isProfile() && !isOrganizationProfile();
    const isPrivateUserProfile = () => isUserProfile() && !exists('.UnderlineNav-item[href$="tab=stars"]');
    const isUserProfileMainTab = () => isUserProfile() && !new URLSearchParams(location.search).has("tab");
    const isUserProfileRepoTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "repositories";
    const isUserProfileStarsTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "stars";
    const isUserProfileFollowersTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "followers";
    const isUserProfileFollowingTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "following";
    const isProfileRepoList = (url = location) => isUserProfileRepoTab(url) || getOrg(url)?.path === "repositories";
    const hasComments = (url = location) => isPR(url) || isIssue(url) || isCommit(url) || isTeamDiscussion(url) || isSingleGist(url);
    const hasRichTextEditor = (url = location) => hasComments(url) || isNewIssue(url) || isCompare(url) || isRepliesSettings(url) || hasReleaseEditor(url) || isDiscussion(url) || isNewDiscussion(url);
    const hasCode = (url = location) => hasComments(url) || isRepoTree(url) || isRepoSearch(url) || isGlobalSearchResults(url) || isSingleFile(url) || isGist(url) || isCompare(url) || isCompareWikiPage(url) || isBlame(url);
    const hasFiles = (url = location) => isCommit(url) || isCompare(url) || isPRFiles(url);
    const isMarketplaceAction = (url = location) => url.pathname.startsWith("/marketplace/actions/");
    const isActionJobRun = (url = location) => Boolean(getRepo(url)?.path.startsWith("runs/"));
    const isActionRun = (url = location) => /^(actions\/)?runs/.test(getRepo(url)?.path);
    const isNewAction = (url = location) => getRepo(url)?.path === "actions/new";
    const isRepositoryActions = (url = location) => /^actions(\/workflows\/.+\.ya?ml)?$/.test(getRepo(url)?.path);
    const isUserTheOrganizationOwner = () => isOrganizationProfile() && exists('[aria-label="Organization"] [data-tab-item="org-header-settings-tab"]');
    const canUserEditRepo = () => isRepo() && exists('.reponav-item[href$="/settings"], [data-tab-item$="settings-tab"]');
    const isNewRepo = (url = location) => url.pathname === "/new" || /^organizations\/[^/]+\/repositories\/new$/.test(getCleanPathname(url));
    const isNewRepoTemplate = (url = location) => Boolean(url.pathname.split("/")[3] === "generate");
    const getUsername = () => $('meta[name="user-login"]')?.getAttribute("content");
    const getCleanPathname = (url = location) => url.pathname.replaceAll(/\/+/g, "/").slice(1, url.pathname.endsWith("/") ? -1 : void 0);
    const getCleanGistPathname = (url = location) => {
      const pathname = getCleanPathname(url);
      if (url.hostname.startsWith("gist.")) {
        return pathname;
      }
      const [gist, ...parts] = pathname.split("/");
      return gist === "gist" ? parts.join("/") : void 0;
    };
    const getOrg = (url = location) => {
      const [, orgs, name, ...path] = url.pathname.split("/");
      if (orgs === "orgs" && name) {
        return { name, path: path.join("/") };
      }
      return void 0;
    };
    const getRepo = (url) => {
      if (!url) {
        const canonical = $('[property="og:url"]');
        if (canonical) {
          const canonicalUrl = new URL(canonical.content, location.origin);
          if (getCleanPathname(canonicalUrl).toLowerCase() === getCleanPathname(location).toLowerCase()) {
            url = canonicalUrl;
          }
        }
      }
      if (typeof url === "string") {
        url = new URL(url, location.origin);
      }
      if (!isRepo(url)) {
        return;
      }
      const [owner, name, ...path] = getCleanPathname(url).split("/");
      return {
        owner,
        name,
        nameWithOwner: owner + "/" + name,
        path: path.join("/")
      };
    };
    const utils = {
      getOrg,
      getUsername,
      getCleanPathname,
      getCleanGistPathname,
      getRepositoryInfo: getRepo
    };
  
    exports.canUserEditRepo = canUserEditRepo;
    exports.hasCode = hasCode;
    exports.hasComments = hasComments;
    exports.hasFileEditor = hasFileEditor;
    exports.hasFiles = hasFiles;
    exports.hasReleaseEditor = hasReleaseEditor;
    exports.hasRepoHeader = hasRepoHeader;
    exports.hasRichTextEditor = hasRichTextEditor;
    exports.hasWikiPageEditor = hasWikiPageEditor;
    exports.is404 = is404;
    exports.is500 = is500;
    exports.isActionJobRun = isActionJobRun;
    exports.isActionRun = isActionRun;
    exports.isArchivedRepo = isArchivedRepo;
    exports.isBlame = isBlame;
    exports.isBlank = isBlank;
    exports.isBranches = isBranches;
    exports.isClosedIssue = isClosedIssue;
    exports.isClosedPR = isClosedPR;
    exports.isCommit = isCommit;
    exports.isCommitList = isCommitList;
    exports.isCompare = isCompare;
    exports.isCompareWikiPage = isCompareWikiPage;
    exports.isConversation = isConversation;
    exports.isDashboard = isDashboard;
    exports.isDeletingFile = isDeletingFile;
    exports.isDiscussion = isDiscussion;
    exports.isDiscussionList = isDiscussionList;
    exports.isDraftPR = isDraftPR;
    exports.isEditingFile = isEditingFile;
    exports.isEditingRelease = isEditingRelease;
    exports.isEditingWikiPage = isEditingWikiPage;
    exports.isEmptyRepo = isEmptyRepo;
    exports.isEmptyRepoRoot = isEmptyRepoRoot;
    exports.isEnterprise = isEnterprise;
    exports.isFileFinder = isFileFinder;
    exports.isForkedRepo = isForkedRepo;
    exports.isGist = isGist;
    exports.isGistProfile = isGistProfile;
    exports.isGistRevision = isGistRevision;
    exports.isGlobalIssueOrPRList = isGlobalIssueOrPRList;
    exports.isGlobalSearchResults = isGlobalSearchResults;
    exports.isIssue = isIssue;
    exports.isIssueOrPRList = isIssueOrPRList;
    exports.isLabelList = isLabelList;
    exports.isMarketplaceAction = isMarketplaceAction;
    exports.isMergedPR = isMergedPR;
    exports.isMilestone = isMilestone;
    exports.isMilestoneList = isMilestoneList;
    exports.isNewAction = isNewAction;
    exports.isNewDiscussion = isNewDiscussion;
    exports.isNewFile = isNewFile;
    exports.isNewIssue = isNewIssue;
    exports.isNewRelease = isNewRelease;
    exports.isNewRepo = isNewRepo;
    exports.isNewRepoTemplate = isNewRepoTemplate;
    exports.isNewWikiPage = isNewWikiPage;
    exports.isNotifications = isNotifications;
    exports.isOpenPR = isOpenPR;
    exports.isOrganizationProfile = isOrganizationProfile;
    exports.isOrganizationRepo = isOrganizationRepo;
    exports.isOwnOrganizationProfile = isOwnOrganizationProfile;
    exports.isOwnUserProfile = isOwnUserProfile;
    exports.isPR = isPR;
    exports.isPRCommit = isPRCommit;
    exports.isPRCommit404 = isPRCommit404;
    exports.isPRCommitList = isPRCommitList;
    exports.isPRConflicts = isPRConflicts;
    exports.isPRConversation = isPRConversation;
    exports.isPRFile404 = isPRFile404;
    exports.isPRFiles = isPRFiles;
    exports.isPRList = isPRList;
    exports.isPasswordConfirmation = isPasswordConfirmation;
    exports.isPrivateUserProfile = isPrivateUserProfile;
    exports.isProfile = isProfile;
    exports.isProfileRepoList = isProfileRepoList;
    exports.isProject = isProject;
    exports.isProjects = isProjects;
    exports.isPublicRepo = isPublicRepo;
    exports.isQuickPR = isQuickPR;
    exports.isReleases = isReleases;
    exports.isReleasesOrTags = isReleasesOrTags;
    exports.isRepliesSettings = isRepliesSettings;
    exports.isRepo = isRepo;
    exports.isRepoCommitList = isRepoCommitList;
    exports.isRepoFile404 = isRepoFile404;
    exports.isRepoForksList = isRepoForksList;
    exports.isRepoHome = isRepoHome;
    exports.isRepoIssueList = isRepoIssueList;
    exports.isRepoIssueOrPRList = isRepoIssueOrPRList;
    exports.isRepoMainSettings = isRepoMainSettings;
    exports.isRepoNetworkGraph = isRepoNetworkGraph;
    exports.isRepoPRList = isRepoPRList;
    exports.isRepoRoot = isRepoRoot;
    exports.isRepoSearch = isRepoSearch;
    exports.isRepoSettings = isRepoSettings;
    exports.isRepoTaxonomyIssueOrPRList = isRepoTaxonomyIssueOrPRList;
    exports.isRepoTree = isRepoTree;
    exports.isRepoWiki = isRepoWiki;
    exports.isRepositoryActions = isRepositoryActions;
    exports.isSingleCommit = isSingleCommit;
    exports.isSingleFile = isSingleFile;
    exports.isSingleGist = isSingleGist;
    exports.isSingleReleaseOrTag = isSingleReleaseOrTag;
    exports.isTags = isTags;
    exports.isTeamDiscussion = isTeamDiscussion;
    exports.isTrending = isTrending;
    exports.isUserProfile = isUserProfile;
    exports.isUserProfileFollowersTab = isUserProfileFollowersTab;
    exports.isUserProfileFollowingTab = isUserProfileFollowingTab;
    exports.isUserProfileMainTab = isUserProfileMainTab;
    exports.isUserProfileRepoTab = isUserProfileRepoTab;
    exports.isUserProfileStarsTab = isUserProfileStarsTab;
    exports.isUserSettings = isUserSettings;
    exports.isUserTheOrganizationOwner = isUserTheOrganizationOwner;
    exports.utils = utils;
  
    Object.defineProperty(exports, '__esModule', { value: true });
  
    return exports;
  
  }({}));
  