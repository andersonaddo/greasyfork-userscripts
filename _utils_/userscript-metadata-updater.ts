#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs"
import { inc, coerce } from "semver"
import * as core from '@actions/core';

// Called periodically by Github Actions.
// This doesn't replace the old instances with the new ones, but merges both lists.
// This is because (at least on Tampermonkey) userscripts don't automatically update when 
// there are new @match clauses in the metadata, so you often have to manually update userscripts to
// stay up to date with Farside's list. It's somewhat annoying. It's easier to just have a list that
// only ever grows, because sometimes instances come in and out day by day.
// We should only add in stances we have't seen before: this reduces the chance we'd have to manually
// update the userscript to still catch Farside's instances becuase we would have kept the ones we've 
// seen before.

const START_DELIM = "\/\/ <<INSTANCES START HERE>>"
const END_DELIM = "\/\/ <<INSTANCES END HERE>>"
const VERSION_DELIM = "\/\/ @version"
const GITHUB_ACTION_ENV_VAR = "SHOULD_COMMIT"

const areSetsEqual = <T>(set1: Set<T>, set2: Set<T>) =>
    set1.size === set2.size && [...set1].every((x) => set2.has(x));

const updateMetadata = async (path: string, targetType: string) => {
    //Reading in the current instances from github
    const instancesRaw = await fetch("https://raw.githubusercontent.com/benbusby/farside/main/services-full.json")
    const instancesParsed = await instancesRaw.json() as Array<Record<string, any>>
    const instances = instancesParsed.find(x => x.type == targetType) ?? {}
    const newInstancesSet = new Set((instances.instances as Array<string>)?.map(x => `// @match ${x}/*`) ?? [])

    //Checking out current instance in the metadata block
    let fileContent = readFileSync(path, 'utf8');
    if (!fileContent) throw new Error("Couldn't get file information")
    let domainRegex = new RegExp(`^${START_DELIM}(.*)${END_DELIM}`, "sm")
    const existingInstancesMatch = fileContent.match(domainRegex)
    const currentInstancesString = existingInstancesMatch ? existingInstancesMatch[1] : ""
    const existingInstancesSet = new Set(currentInstancesString.trim().split("\n"))

    //Merging the instances in our metadata block with new instances, returning if there's no difference
    const resultantInstancesSet = new Set([...newInstancesSet, ...existingInstancesSet])
    if (areSetsEqual(resultantInstancesSet, existingInstancesSet)){
        console.log("No change in instances, aborting early")
        return
    }else{
        console.log("Change in instances detected! Commiting change")
    }
    const resultantInstancesString = Array.from(resultantInstancesSet).join("\n")
    domainRegex = new RegExp(`^${START_DELIM}.*${END_DELIM}`, "sm")
    fileContent = fileContent.replace(domainRegex, `${START_DELIM}\n${resultantInstancesString}\n${END_DELIM}`)

    //Bumping version
    const versionRegex = new RegExp(`^${VERSION_DELIM}\\s*(\\d+(.\\d+){0,2})\\s*$`, "m")
    const originalVersionRegex = fileContent.match(versionRegex)
    if (!originalVersionRegex) throw new Error("Couldn't find version information")
    const newVersion = inc(coerce(originalVersionRegex[1]), "minor")
    fileContent = fileContent.replace(originalVersionRegex[0], originalVersionRegex[0].replace(originalVersionRegex[1], newVersion));  
    core.exportVariable(GITHUB_ACTION_ENV_VAR, "YES")

    writeFileSync(path, fileContent)
}

(async () => {
    await updateMetadata("../reddit-userscripts/auto-libreddit-quota-error-redirect.js", "libreddit")
    await updateMetadata("../reddit-userscripts/libreddit-new-instance-button.js", "libreddit")
    await updateMetadata("../reddit-userscripts/libreddit-quirk-fixer.js", "libreddit")
    await updateMetadata("../tiktok-userscripts/proxitok-error-redirector.js", "proxitok")
})()