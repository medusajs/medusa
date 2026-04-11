#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

/**
 * Analyze dependency sizes across all workspace packages
 */

// Get all package.json files
const packagesOutput = execSync(
  'find packages -name "package.json" -not -path "*/node_modules/*"',
  {
    cwd: path.join(__dirname, "../../"),
    encoding: "utf8",
  }
)

const packagePaths = packagesOutput.trim().split("\n").filter(Boolean)

console.log(`Found ${packagePaths.length} packages\n`)

// Collect all dependencies across the workspace
const allDependencies = new Map()
const packageDependencies = []

for (const pkgPath of packagePaths) {
  const fullPath = path.join(__dirname, "../..", pkgPath)
  const packageJson = JSON.parse(fs.readFileSync(fullPath, "utf8"))

  const deps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  }

  packageDependencies.push({
    name: packageJson.name,
    path: pkgPath,
    dependencies: deps,
    depCount: Object.keys(deps || {}).length,
  })

  // Aggregate dependencies
  for (const [dep, version] of Object.entries(deps || {})) {
    if (!allDependencies.has(dep)) {
      allDependencies.set(dep, { count: 0, versions: new Set(), packages: [] })
    }
    const info = allDependencies.get(dep)
    info.count++
    info.versions.add(version)
    info.packages.push(packageJson.name)
  }
}

// Sort packages by dependency count
packageDependencies.sort((a, b) => b.depCount - a.depCount)

console.log("=== Packages with Most Dependencies ===\n")
packageDependencies.slice(0, 15).forEach((pkg) => {
  console.log(`${pkg.name}: ${pkg.depCount} dependencies`)
})

console.log("\n=== Most Common Dependencies ===\n")
const sortedDeps = Array.from(allDependencies.entries())
  .sort((a, b) => b[1].count - a[1].count)
  .slice(0, 30)

sortedDeps.forEach(([dep, info]) => {
  const versionInfo =
    info.versions.size > 1 ? ` ⚠️  (${info.versions.size} versions)` : ""
  console.log(`${dep}: used in ${info.count} packages${versionInfo}`)
})

// Find dependencies with multiple versions
console.log("\n=== Dependencies with Version Conflicts ===\n")
const conflicts = Array.from(allDependencies.entries())
  .filter(([_, info]) => info.versions.size > 1)
  .sort((a, b) => b[1].versions.size - a[1].versions.size)

if (conflicts.length > 0) {
  conflicts.slice(0, 20).forEach(([dep, info]) => {
    console.log(`${dep}:`)
    console.log(`  Versions: ${Array.from(info.versions).join(", ")}`)
    console.log(`  Used in ${info.count} packages\n`)
  })
} else {
  console.log("No version conflicts found!\n")
}

// Analyze large dependencies (if node_modules exists)
console.log("=== Analyzing Installed Dependency Sizes ===\n")
const nodeModulesPath = path.join(__dirname, "../../", "node_modules")

if (fs.existsSync(nodeModulesPath)) {
  try {
    // Use du to get sizes of top-level node_modules directories
    const duOutput = execSync(
      `du -sh node_modules/* 2>/dev/null | sort -hr | head -50`,
      {
        cwd: path.join(__dirname, "../../"),
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"], // Suppress stderr
      }
    )

    console.log("Top 50 Largest Dependencies by Install Size:\n")
    console.log(duOutput)
  } catch (error) {
    console.log("Could not analyze node_modules sizes\n")
  }
} else {
  console.log("node_modules not found. Run `yarn install` first.\n")
}

// Save detailed report
const report = {
  totalPackages: packagePaths.length,
  totalUniqueDependencies: allDependencies.size,
  packagesWithMostDeps: packageDependencies.slice(0, 20),
  mostCommonDeps: sortedDeps.map(([dep, info]) => ({
    name: dep,
    usedInPackages: info.count,
    versions: Array.from(info.versions),
    hasConflict: info.versions.size > 1,
  })),
  versionConflicts: conflicts.map(([dep, info]) => ({
    name: dep,
    versions: Array.from(info.versions),
    packages: info.packages,
  })),
}

const reportPath = path.join(__dirname, "../../", "dependency-analysis.json")
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(`\nDetailed report saved to: dependency-analysis.json`)
