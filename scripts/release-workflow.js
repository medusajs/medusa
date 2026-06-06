// scripts/release-workflow.js
//
// Core-flows-only release: publishes core-flows and medusa at a given version.
// Ported from medusa-freshbox and adapted for the @zjedene-medusa scope.
//
// Improvements over the original:
// - Already-published pre-check (npm returns 403 on republish — playbook A5 rule 3)
// - Cross-dependency updates are workspace-wide (playbook A5 rule 2)
//
// NOTE: this script does NOT auto-commit. Commit the version-bumped
// package.json files after a successful release.
//
// Usage: node scripts/release-workflow.js <version>
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util")
const sleep = promisify(setTimeout)

// Configuration
const SCOPE = "@zjedene-medusa"
const DELAY_BETWEEN_PUBLISHES = 10000 // 10 seconds delay between publishes
const MAX_RETRIES = 3
const RETRY_DELAY = 30000 // 30 seconds delay before retry

// Packages to publish, in dependency order
const CORE_PACKAGES = [
  {
    name: `${SCOPE}/core-flows`,
    publishName: `${SCOPE}/core-flows`,
    path: "packages/core/core-flows",
  },
  {
    name: `${SCOPE}/medusa`,
    publishName: `${SCOPE}/medusa`,
    path: "packages/medusa",
  },
]

// All workspace package.json files (excludes node_modules, dist, www)
function findWorkspacePackageJsons() {
  const output = execSync(
    `find packages integration-tests -name "package.json" -not -path "*/node_modules/*" -not -path "*/dist/*"`,
    { encoding: "utf8" }
  )
  return output
    .split("\n")
    .filter(Boolean)
    .map((p) => path.join(process.cwd(), p))
}

async function verifyPackageVersion(pkg, expectedVersion, maxAttempts = 10) {
  console.log(
    `\n🔍 Verifying ${pkg.publishName}@${expectedVersion} on npm registry...`
  )

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Clear yarn cache
      execSync(`yarn cache clean`, { stdio: "inherit" })

      const output = execSync(`npm view ${pkg.publishName} dist-tags.latest`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      })

      const publishedVersion = output.trim()
      if (publishedVersion === expectedVersion) {
        console.log(
          `✅ Verified ${pkg.publishName}@${expectedVersion} is available`
        )
        return true
      }

      console.log(
        `⏳ Attempt ${attempt}/${maxAttempts} - Found version ${publishedVersion}, waiting for ${expectedVersion}...`
      )
      await sleep(30000)
    } catch (error) {
      console.log(
        `⏳ Attempt ${attempt}/${maxAttempts} - Package not found, retrying...`
      )
      await sleep(30000)
    }
  }

  throw new Error(
    `Failed to verify ${pkg.publishName}@${expectedVersion} after ${maxAttempts} attempts`
  )
}

function updatePackageVersion(packagePath, newVersion) {
  const packageJsonPath = path.join(process.cwd(), packagePath, "package.json")

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`Package.json not found at ${packageJsonPath}`)
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
  const oldVersion = packageJson.version
  packageJson.version = newVersion

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")
  return oldVersion
}

// Update a published package's version in EVERY workspace package that
// references it (dependencies, peerDependencies, devDependencies).
function updateDependentsAcrossWorkspace(dependencyName, newVersion) {
  const dependencyTypes = [
    "dependencies",
    "peerDependencies",
    "devDependencies",
  ]
  const updatedIn = []

  for (const packageJsonPath of findWorkspacePackageJsons()) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
    let updated = false

    dependencyTypes.forEach((depType) => {
      if (
        packageJson[depType] &&
        packageJson[depType][dependencyName] &&
        packageJson[depType][dependencyName] !== newVersion
      ) {
        packageJson[depType][dependencyName] = newVersion
        updated = true
      }
    })

    if (updated) {
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + "\n"
      )
      updatedIn.push(path.relative(process.cwd(), packageJsonPath))
    }
  }

  if (updatedIn.length > 0) {
    console.log(
      `✅ Updated ${dependencyName} to ${newVersion} in:\n${updatedIn
        .map((p) => `  - ${p}`)
        .join("\n")}`
    )
  }
}

function isAlreadyPublished(pkg, version) {
  try {
    const output = execSync(`npm view ${pkg.publishName}@${version} version`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim()
    return output === version
  } catch {
    return false
  }
}

async function buildAndPublishPackage(pkg, newVersion) {
  console.log(`\n🏗️  Processing ${pkg.publishName}...`)

  // Skip if already published (npm returns 403 on republish)
  if (isAlreadyPublished(pkg, newVersion)) {
    console.log(
      `⏭️  ${pkg.publishName}@${newVersion} already published, skipping...`
    )

    // Still update version in package.json and dependent packages
    updatePackageVersion(pkg.path, newVersion)
    updateDependentsAcrossWorkspace(pkg.publishName, newVersion)

    return true
  }

  // Update package version
  try {
    const oldVersion = updatePackageVersion(pkg.path, newVersion)
    console.log(
      `✅ Updated ${pkg.publishName} from ${oldVersion} to ${newVersion}`
    )
  } catch (error) {
    console.error(
      `❌ Failed to update version for ${pkg.publishName}:`,
      error.message
    )
    return false
  }

  // Build
  console.log(`\n🏗️  Building ${pkg.path}...`)
  try {
    execSync("yarn build", {
      cwd: path.join(process.cwd(), pkg.path),
      stdio: "inherit",
    })
    console.log(`✅ Build successful for ${pkg.publishName}`)
  } catch (error) {
    console.error(`❌ Build failed for ${pkg.publishName}:`, error.message)
    return false
  }

  // Publish
  let retries = 0
  while (retries < MAX_RETRIES) {
    try {
      console.log(`\n📦 Publishing ${pkg.publishName}...`)

      execSync(`yarn cache clean`, { stdio: "inherit" })

      execSync(
        `npm publish --tag ${
          newVersion.includes("-") ? "beta" : "latest"
        } --access public`,
        {
          cwd: path.join(process.cwd(), pkg.path),
          stdio: "inherit",
        }
      )

      await verifyPackageVersion(pkg, newVersion)

      console.log(`✅ Successfully published ${pkg.publishName}`)

      // Update this package's version in every dependent workspace package
      updateDependentsAcrossWorkspace(pkg.publishName, newVersion)

      return true
    } catch (error) {
      retries++
      console.error(
        `❌ Failed to publish ${pkg.publishName} (attempt ${retries}/${MAX_RETRIES})`
      )
      console.error(error.message)

      if (retries < MAX_RETRIES) {
        console.log(
          `⏳ Waiting ${RETRY_DELAY / 1000} seconds before retrying...`
        )
        await sleep(RETRY_DELAY)
      }
    }
  }

  return false
}

async function main() {
  // Get version from command line argument
  const newVersion = process.argv[2]
  if (!newVersion) {
    console.error("❌ Please provide a version number")
    console.log("Usage: node scripts/release-workflow.js <version>")
    console.log("Example: node scripts/release-workflow.js 2.15.5")
    process.exit(1)
  }

  if (!/^\d+\.\d+\.\d+(-\w+(\.\d+)?)?$/.test(newVersion)) {
    console.error(
      "❌ Invalid version format. Please use semantic versioning (e.g., 2.15.5 or 2.15.5-beta.1)"
    )
    process.exit(1)
  }

  // Confirm with user
  console.log(
    `\n🚀 Preparing to release version ${newVersion} for core packages in this order:`
  )
  CORE_PACKAGES.forEach((pkg) => {
    console.log(`- ${pkg.publishName} (${pkg.path})`)
  })
  console.log(
    "\nAfter each publish, the new version is propagated to every workspace package that references it."
  )

  // Wait for 5 seconds to allow cancellation
  console.log("\n⚠️  Press Ctrl+C within 5 seconds to cancel...")
  await sleep(5000)

  // Process each package sequentially
  for (const pkg of CORE_PACKAGES) {
    console.log(`\n\n📦 Processing ${pkg.publishName}...`)

    const success = await buildAndPublishPackage(pkg, newVersion)

    if (!success) {
      console.error(
        `\n❌ Failed to process ${pkg.publishName}. Stopping release process.`
      )
      process.exit(1)
    }

    console.log(`\n✅ Successfully processed ${pkg.publishName}`)

    // Add delay before next package unless it's the last one
    if (CORE_PACKAGES.indexOf(pkg) < CORE_PACKAGES.length - 1) {
      console.log(
        `\n⏳ Waiting ${
          DELAY_BETWEEN_PUBLISHES / 1000
        } seconds before processing next package...`
      )
      await sleep(DELAY_BETWEEN_PUBLISHES)
    }
  }

  // Summary
  console.log("\n✨ Release completed successfully!")
  console.log("\nPackages updated and published in order:")
  CORE_PACKAGES.forEach((pkg) => {
    console.log(`- ${pkg.publishName}@${newVersion}`)
  })
  console.log(
    "\n📝 Remember: this script does not auto-commit. Commit the version-bumped package.json files now."
  )

  // Installation instructions
  console.log("\n📋 Installation Instructions for Users:")
  console.log("Run these commands to ensure you get the latest versions:")
  console.log("\n```bash")
  console.log("yarn cache clean")
  console.log("rm -rf node_modules yarn.lock")
  console.log("yarn install")
  console.log("```")
}

// Run the script
main().catch((error) => {
  console.error("❌ Error during release:", error)
  process.exit(1)
})
