const fs = require("fs")
const path = require("path")

class VersionHelper {
  static getCurrentVersion() {
    const packagePath = path.join(process.cwd(), "package.json")
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
    return packageJson.version
  }

  static updateVersion(newVersion) {
    const packagePath = path.join(process.cwd(), "package.json")
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))

    packageJson.version = newVersion

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n")
    console.log(`Version updated to ${newVersion}`)
  }

  static parseVersion(version) {
    const [major, minor, patch] = version.split(".").map(Number)
    return { major, minor, patch }
  }

  static incrementVersion(currentVersion, type) {
    const { major, minor, patch } = this.parseVersion(currentVersion)

    switch (type) {
      case "major":
        return `${major + 1}.0.0`
      case "minor":
        return `${major}.${minor + 1}.0`
      case "patch":
        return `${major}.${minor}.${patch + 1}`
      default:
        throw new Error(`Invalid version type: ${type}`)
    }
  }

  static suggestVersionFromCommits(commits) {
    const commitMessages = commits.join(" ").toLowerCase()

    // Check for breaking changes
    if (
      commitMessages.includes("breaking") ||
      commitMessages.includes("major") ||
      /feat!:|fix!:/.test(commitMessages)
    ) {
      return "major"
    }

    // Check for new features
    if (commitMessages.includes("feat:") || commitMessages.includes("feature") || commitMessages.includes("add:")) {
      return "minor"
    }

    // Default to patch
    return "patch"
  }
}

module.exports = VersionHelper

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case "current":
      console.log(VersionHelper.getCurrentVersion())
      break
    case "increment":
      const type = args[1]
      const current = VersionHelper.getCurrentVersion()
      const newVersion = VersionHelper.incrementVersion(current, type)
      console.log(newVersion)
      break
    default:
      console.log("Usage: node version-helper.js [current|increment <type>]")
  }
}
