#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs"
import { inc, coerce } from "semver"

// Called periodically by Github Actions

const START_DELIM = "\/\/ <<INSTANCES START HERE>>"
const END_DELIM = "\/\/ <<INSTANCES END HERE>>"
const VERSION_DELIM = "\/\/ @version"

const updateMetadata = async (path: string) => {
    //Constructing the new metadata
    const instancesRaw = await fetch("https://raw.githubusercontent.com/benbusby/farside/main/services-full.json")
    const libredditRes = await instancesRaw.json() as Array<Record<string, any>>
    const instances = libredditRes.find(x => x.type = "libreddit") ?? {}
    const newMetadataArray = (instances.instances as Array<string>)?.map(x => `// @match ${x}/*`) ?? []
    const newMetadataString = newMetadataArray.join("\n")

    const domainRegex = new RegExp(`^${START_DELIM}.*${END_DELIM}`, "sm")
    const versionRegex = new RegExp(`^${VERSION_DELIM}\\s*(\\d+(.\\d+){0,2})\\s*$`, "m")

    let fileContent = readFileSync(path, 'utf8');
    if (!fileContent) throw new Error("Couldn't get file information")

    fileContent = fileContent.replace(domainRegex, `${START_DELIM}\n${newMetadataString}\n${END_DELIM}`)

    const originalVersionRegex = fileContent.match(versionRegex)
    if (!originalVersionRegex) throw new Error("Couldn't find version information")

    const newVersion = inc(coerce(originalVersionRegex[1]), "minor")
    fileContent = fileContent.replace(originalVersionRegex[0], originalVersionRegex[0].replace(originalVersionRegex[1], newVersion));
    writeFileSync(path, fileContent)
}

(async () => {
    await updateMetadata("../auto-libreddit-quota-redirect.js")
    await updateMetadata("../libreddit-new-instance-button.js")
})()