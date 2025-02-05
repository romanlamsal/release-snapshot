import { execSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const packageJsonPath = join(process.cwd(), "package.json")

const currentPackageJsonFileContents = readFileSync(packageJsonPath, "utf8")
const packageJsonContents = JSON.parse(currentPackageJsonFileContents)

if (!packageJsonContents.version) {
    throw new Error(`Could not find a version in package.json at ${packageJsonPath}.`)
}

const now = new Date()
const snapshotTimestamp = [
    now.getFullYear(),
    (now.getMonth() + 1).toString().padStart(2, "0"),
    now.getDate().toString().padStart(2, "0"),
    "-",
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0"),
].join("")

function getPublishArgs() {
    const doubleDashIdx = process.argv.findIndex(argv => argv === "--")

    if (doubleDashIdx === -1) {
        return []
    }

    const serializedArgs = process.argv.slice(doubleDashIdx + 1, process.argv.length).join(" ")

    const hasTagArg = process.argv.findIndex(argv => argv === "--tag") !== -1
    if (!hasTagArg) {
        return `--tag ${snapshotTimestamp} ${serializedArgs}`
    }

    return serializedArgs
}

try {
    packageJsonContents.version += `-SNAPSHOT-${snapshotTimestamp}`
    writeFileSync(packageJsonPath, JSON.stringify(packageJsonContents, null, 2))

    const npmPublishArgs = getPublishArgs()

    execSync(`npm publish ${npmPublishArgs}`, { stdio: "inherit" })
} finally {
    writeFileSync(packageJsonPath, currentPackageJsonFileContents)
}
