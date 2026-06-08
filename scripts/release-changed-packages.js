// scripts/release-changed-packages.js
//
// Detects @zjedene-medusa/* workspace packages whose source has changed since a given
// git ref, bumps each to the target version, builds, publishes in dependency
// order, and propagates the new version into every workspace package.json that
// references it.
//
// Usage:
//   node scripts/release-changed-packages.js <version> [options]
//
// Options:
//   --since <ref>      Git ref to diff against. Default: latest tag matching
//                      v* or @zjedene-medusa/*, falling back to HEAD~1 (with warning).
//   --include <names>  Comma-separated extra package names to force-include.
//   --exclude <names>  Comma-separated package names to skip.
//   --dry-run          Print the plan, make no changes, publish nothing.
//   --skip-build       Skip `yarn build` (packages must already be built).
//   --skip-verify      Skip post-publish npm registry verification.
//   --allow-dirty      Suppress the warning about uncommitted changes.
//   -h, --help         Show this help.
//
// Examples:
//   node scripts/release-changed-packages.js 2.12.0
//   node scripts/release-changed-packages.js 2.12.0 --since HEAD~5
//   node scripts/release-changed-packages.js 2.12.0-beta.1 --dry-run

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util")
const { globSync } = require("glob")

const sleep = promisify(setTimeout)

const DELAY_BETWEEN_PUBLISHES = 10000
const MAX_RETRIES = 3
const RETRY_DELAY = 30000
const VERIFY_ATTEMPTS = 10
const VERIFY_INTERVAL = 15000
const SCOPE = "@zjedene-medusa/"
const REPO_ROOT = process.cwd()

// ---------- CLI ----------

function parseArgs(argv) {
  const args = {
    version: null,
    since: null,
    include: [],
    exclude: [],
    dryRun: false,
    skipBuild: false,
    skipVerify: false,
    allowDirty: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--help" || a === "-h") {
      printHelp()
      process.exit(0)
    } else if (a === "--since") {
      args.since = argv[++i]
    } else if (a === "--include") {
      args.include = argv[++i].split(",").map((s) => s.trim()).filter(Boolean)
    } else if (a === "--exclude") {
      args.exclude = argv[++i].split(",").map((s) => s.trim()).filter(Boolean)
    } else if (a === "--dry-run") {
      args.dryRun = true
    } else if (a === "--skip-build") {
      args.skipBuild = true
    } else if (a === "--skip-verify") {
      args.skipVerify = true
    } else if (a === "--allow-dirty") {
      args.allowDirty = true
    } else if (!a.startsWith("--") && !args.version) {
      args.version = a
    } else {
      console.error(`Unknown argument: ${a}`)
      printHelp()
      process.exit(1)
    }
  }
  return args
}

function printHelp() {
  console.log(
    fs
      .readFileSync(__filename, "utf8")
      .split("\n")
      .filter((l) => l.startsWith("//"))
      .map((l) => l.replace(/^\/\/ ?/, ""))
      .join("\n")
  )
}

// ---------- Workspace discovery ----------

function discoverWorkspacePackages() {
  const rootPkg = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8")
  )
  const patterns =
    (rootPkg.workspaces && (rootPkg.workspaces.packages || rootPkg.workspaces)) ||
    []

  const seen = new Set()
  const packages = []

  for (const pattern of patterns) {
    const matches = globSync(`${pattern}/package.json`, {
      cwd: REPO_ROOT,
      ignore: ["**/node_modules/**"],
    })
    for (const match of matches) {
      const relDir = path.dirname(match)
      if (seen.has(relDir)) continue
      seen.add(relDir)

      const absDir = path.join(REPO_ROOT, relDir)
      let pkgJson
      try {
        pkgJson = JSON.parse(
          fs.readFileSync(path.join(absDir, "package.json"), "utf8")
        )
      } catch {
        continue
      }
      if (!pkgJson.name || !pkgJson.name.startsWith(SCOPE)) continue
      if (pkgJson.private) continue

      packages.push({
        name: pkgJson.name,
        version: pkgJson.version,
        relPath: relDir,
        absPath: absDir,
        dependencies: pkgJson.dependencies || {},
        peerDependencies: pkgJson.peerDependencies || {},
        devDependencies: pkgJson.devDependencies || {},
      })
    }
  }

  return packages
}

// ---------- Change detection ----------

function detectSinceRef() {
  const candidates = [
    'git describe --tags --abbrev=0 --match "v*"',
    'git describe --tags --abbrev=0 --match "@zjedene-medusa/*"',
  ]
  for (const cmd of candidates) {
    try {
      const out = execSync(cmd, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim()
      if (out) return { ref: out, auto: true }
    } catch {
      // no matching tag; try next
    }
  }
  return { ref: "HEAD~1", auto: true, fallback: true }
}

function getChangedFiles(sinceRef) {
  const committed = execSync(`git diff --name-only ${sinceRef}..HEAD`, {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
  let uncommitted = []
  try {
    uncommitted = execSync("git diff --name-only HEAD", { encoding: "utf8" })
      .split("\n")
      .filter(Boolean)
  } catch {
    // empty tree; ignore
  }
  return Array.from(new Set([...committed, ...uncommitted]))
}

function filesToChangedPackages(changedFiles, packages) {
  const sorted = [...packages].sort(
    (a, b) => b.relPath.length - a.relPath.length
  )
  const changed = new Set()
  for (const file of changedFiles) {
    for (const pkg of sorted) {
      if (file === pkg.relPath + "/package.json") {
        changed.add(pkg.name)
        break
      }
      if (!file.startsWith(pkg.relPath + "/")) continue
      const rel = file.substring(pkg.relPath.length + 1)
      if (
        rel.startsWith("dist/") ||
        rel.startsWith("node_modules/") ||
        rel.startsWith(".turbo/") ||
        rel === "tsconfig.tsbuildinfo" ||
        rel.endsWith(".tsbuildinfo")
      ) {
        break
      }
      changed.add(pkg.name)
      break
    }
  }
  return changed
}

// ---------- Topological sort ----------

function topoSortForPublish(selected, allPackages) {
  const byName = new Map(allPackages.map((p) => [p.name, p]))
  const inSet = new Set(selected.map((p) => p.name))

  const indegree = new Map()
  const edges = new Map()

  for (const pkg of selected) {
    indegree.set(pkg.name, 0)
    edges.set(pkg.name, [])
  }

  for (const pkg of selected) {
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.peerDependencies,
    }
    for (const depName of Object.keys(allDeps)) {
      if (inSet.has(depName) && depName !== pkg.name) {
        edges.get(depName).push(pkg.name)
        indegree.set(pkg.name, indegree.get(pkg.name) + 1)
      }
    }
  }

  const queue = []
  for (const [name, deg] of indegree) {
    if (deg === 0) queue.push(name)
  }
  queue.sort()

  const ordered = []
  while (queue.length) {
    const name = queue.shift()
    ordered.push(byName.get(name))
    const nextBatch = []
    for (const dep of edges.get(name)) {
      const newDeg = indegree.get(dep) - 1
      indegree.set(dep, newDeg)
      if (newDeg === 0) nextBatch.push(dep)
    }
    nextBatch.sort()
    queue.push(...nextBatch)
  }

  if (ordered.length !== selected.length) {
    const remaining = [...indegree.entries()]
      .filter(([, d]) => d > 0)
      .map(([n]) => n)
    throw new Error(
      `Cycle in @zjedene-medusa/* dependency graph across: ${remaining.join(", ")}`
    )
  }

  return ordered
}

// ---------- File ops ----------

function writePackageJson(absDir, json) {
  fs.writeFileSync(
    path.join(absDir, "package.json"),
    JSON.stringify(json, null, 2) + "\n"
  )
}

function bumpPackageVersion(pkg, newVersion) {
  const pkgJsonPath = path.join(pkg.absPath, "package.json")
  const json = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"))
  const oldVersion = json.version
  json.version = newVersion
  writePackageJson(pkg.absPath, json)
  return oldVersion
}

function propagateDependencyVersion(allPackages, depName, newVersion) {
  const fields = ["dependencies", "peerDependencies", "devDependencies"]
  const touched = []
  for (const pkg of allPackages) {
    const pkgJsonPath = path.join(pkg.absPath, "package.json")
    const json = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"))
    let dirty = false
    for (const field of fields) {
      if (!json[field] || !json[field][depName]) continue
      const current = json[field][depName]
      if (typeof current !== "string") continue
      if (current.startsWith("workspace:")) continue
      if (current === newVersion) continue
      json[field][depName] = newVersion
      dirty = true
    }
    if (dirty) {
      writePackageJson(pkg.absPath, json)
      touched.push(pkg.name)
    }
  }
  return touched
}

// ---------- Build + publish ----------

function buildPackage(pkg) {
  console.log(`\nBuilding ${pkg.name}...`)
  execSync("yarn build", { cwd: pkg.absPath, stdio: "inherit" })
}

async function publishPackageWithRetry(pkg, newVersion) {
  const tag = newVersion.includes("-") ? "beta" : "latest"
  let attempt = 0
  while (attempt < MAX_RETRIES) {
    attempt++
    try {
      console.log(
        `\nPublishing ${pkg.name}@${newVersion} (attempt ${attempt}/${MAX_RETRIES}, tag=${tag})`
      )
      execSync(`npm publish --tag ${tag} --access public`, {
        cwd: pkg.absPath,
        stdio: "inherit",
      })
      return
    } catch (err) {
      console.error(
        `Publish failed for ${pkg.name} (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`
      )
      if (attempt >= MAX_RETRIES) throw err
      console.log(`Waiting ${RETRY_DELAY / 1000}s before retry...`)
      await sleep(RETRY_DELAY)
    }
  }
}

async function verifyOnRegistry(pkg, expectedVersion) {
  console.log(`Verifying ${pkg.name}@${expectedVersion} on npm registry...`)
  for (let i = 1; i <= VERIFY_ATTEMPTS; i++) {
    try {
      const out = execSync(`npm view ${pkg.name}@${expectedVersion} version`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim()
      if (out === expectedVersion) {
        console.log(`Confirmed ${pkg.name}@${expectedVersion}`)
        return
      }
    } catch {
      // not yet visible
    }
    if (i < VERIFY_ATTEMPTS) {
      console.log(
        `  attempt ${i}/${VERIFY_ATTEMPTS}, waiting ${VERIFY_INTERVAL / 1000}s...`
      )
      await sleep(VERIFY_INTERVAL)
    }
  }
  throw new Error(
    `Could not verify ${pkg.name}@${expectedVersion} after ${VERIFY_ATTEMPTS} attempts`
  )
}

// ---------- Preflight ----------

function preflightNpmAuth() {
  try {
    const who = execSync(
      "npm whoami --registry https://registry.npmjs.org/",
      { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
    ).trim()
    console.log(`Authenticated to npmjs.org as: ${who}`)
  } catch {
    console.error(
      "Not authenticated to npmjs.org. Run:\n  npm login --registry https://registry.npmjs.org/\nOr set //registry.npmjs.org/:_authToken=<token> in ~/.npmrc"
    )
    process.exit(1)
  }
}

function preflightGitClean(allowDirty) {
  try {
    const out = execSync("git status --porcelain", { encoding: "utf8" }).trim()
    if (out && !allowDirty) {
      console.warn(
        "Working tree has uncommitted changes. The script will stage version bumps on top of them.\nPass --allow-dirty to silence this warning.\n"
      )
    }
  } catch {
    // not a git repo; ignore
  }
}

// ---------- Main ----------

async function main() {
  const args = parseArgs(process.argv)

  if (!args.version) {
    printHelp()
    process.exit(1)
  }
  if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(args.version)) {
    console.error(
      `Invalid version: "${args.version}". Use semver (e.g. 2.12.0 or 2.12.0-beta.1)`
    )
    process.exit(1)
  }

  if (!args.dryRun) preflightNpmAuth()
  preflightGitClean(args.allowDirty)

  let sinceRef, sinceAuto, sinceFallback
  if (args.since) {
    sinceRef = args.since
    sinceAuto = false
  } else {
    const detected = detectSinceRef()
    sinceRef = detected.ref
    sinceAuto = detected.auto
    sinceFallback = !!detected.fallback
  }

  console.log(
    `Diffing against: ${sinceRef}${
      sinceAuto ? (sinceFallback ? " (fallback; no tag found)" : " (auto)") : ""
    }`
  )
  if (sinceFallback) {
    console.warn(
      "No release tag found. Consider passing --since <ref> explicitly for reproducible releases."
    )
  }

  const allPackages = discoverWorkspacePackages()
  console.log(`Found ${allPackages.length} publishable @zjedene-medusa/* packages`)

  const changedFiles = getChangedFiles(sinceRef)
  const changedNames = filesToChangedPackages(changedFiles, allPackages)

  for (const name of args.include) changedNames.add(name)
  for (const name of args.exclude) changedNames.delete(name)

  const selected = allPackages.filter((p) => changedNames.has(p.name))

  if (selected.length === 0) {
    console.log(
      `No @zjedene-medusa/* packages changed since ${sinceRef}. Nothing to publish.`
    )
    return
  }

  const ordered = topoSortForPublish(selected, allPackages)

  console.log(
    `\nRelease plan: ${ordered.length} package(s) -> ${args.version}`
  )
  ordered.forEach((pkg, i) => {
    console.log(`  ${i + 1}. ${pkg.name}  (${pkg.version} -> ${args.version})`)
  })

  if (args.dryRun) {
    console.log("\nDry run; stopping before any side effects.")
    return
  }

  console.log("\nPress Ctrl+C within 5 seconds to cancel...")
  await sleep(5000)

  const results = []
  for (let i = 0; i < ordered.length; i++) {
    const pkg = ordered[i]
    console.log(
      `\n====================================================================`
    )
    console.log(`Processing ${pkg.name} (${i + 1}/${ordered.length})`)
    console.log(
      `====================================================================`
    )

    try {
      const oldVersion = bumpPackageVersion(pkg, args.version)
      console.log(`Bumped ${pkg.name}: ${oldVersion} -> ${args.version}`)

      const touched = propagateDependencyVersion(
        allPackages,
        pkg.name,
        args.version
      )
      if (touched.length) {
        console.log(
          `Updated ${pkg.name} version reference in: ${touched.join(", ")}`
        )
      }

      if (!args.skipBuild) {
        buildPackage(pkg)
      }

      await publishPackageWithRetry(pkg, args.version)

      if (!args.skipVerify) {
        await verifyOnRegistry(pkg, args.version)
      }

      results.push({ name: pkg.name, status: "published" })
    } catch (err) {
      results.push({
        name: pkg.name,
        status: "failed",
        error: err.message,
      })
      console.error(`\nStopping: ${pkg.name} failed.`)
      break
    }

    if (i < ordered.length - 1) {
      console.log(
        `Waiting ${DELAY_BETWEEN_PUBLISHES / 1000}s before next package...`
      )
      await sleep(DELAY_BETWEEN_PUBLISHES)
    }
  }

  console.log(
    `\n====================================================================`
  )
  console.log(`SUMMARY`)
  console.log(
    `====================================================================`
  )
  for (const r of results) {
    const mark = r.status === "published" ? "[OK] " : "[FAIL]"
    console.log(`${mark} ${r.name}${r.error ? ` - ${r.error}` : ""}`)
  }
  const failed = results.filter((r) => r.status === "failed")
  const skipped = ordered.length - results.length
  if (skipped > 0) {
    console.log(
      `${skipped} package(s) not processed due to earlier failure:`
    )
    for (const pkg of ordered.slice(results.length)) {
      console.log(`  - ${pkg.name}`)
    }
  }
  if (failed.length > 0) process.exit(1)
}

main().catch((err) => {
  console.error("\nError during release:", err)
  process.exit(1)
})
