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
    now.getMonth() + 1,
    now.getDate(),
    "-",
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
].join("")

try {
    packageJsonContents.version += `-SNAPSHOT-${snapshotTimestamp}`
    writeFileSync(packageJsonPath, JSON.stringify(packageJsonContents, null, 2))

    execSync(`npm publish --tag ${snapshotTimestamp} --access public`, { stdio: "inherit" })
} finally {
    writeFileSync(packageJsonPath, currentPackageJsonFileContents)
}
