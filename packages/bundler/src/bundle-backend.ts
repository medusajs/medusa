import { existsSync, readdirSync, readFileSync, rmSync, statSync } from "fs"
import { writeFile } from "fs/promises"
import { createRequire } from "module"
import path from "path"
import { BUNDLE_FILE_NAME, MAIN_FILE_NAME } from "./constants"
import { keyManifest } from "./manifest"
import {
  findNodeModulesRoot,
  findPackageRoot,
  packageDistOf,
  readPackageName,
} from "./packages"
import { createPathKeys } from "./paths"
import { createEntry } from "./runtime/entry"
import { LAUNCHER } from "./runtime/launcher"
import {
  addPackageExportResolutions,
  createBuildOnlyCommandMatcher,
  createRegistrable,
  findUnusedModuleEntries,
  FIRST_PARTY_TEST_FILE,
  packagesResolvedByName,
  scanDirectory,
} from "./selection"
import { copyTracedFiles, vendorPackages } from "./trace"
import { createTransforms, SIDE_EFFECT } from "./transforms"
import type { BundleBackendOptions } from "./types"

/**
 * Bundles the compiled backend in `outDir` into a single file, using what the
 * collection pass found to make boot evaluate as little as possible:
 *
 * - routes, middlewares, subscribers, workflows and hooks load on first use
 * - re-export files and package imports in first-party code are lazy
 * - file identity (`__filename`, `defineFileConfig`, ...) survives bundling
 */
export async function bundleBackend({
  directory,
  outDir,
  logger,
  medusaDist,
  collect,
}: BundleBackendOptions) {
  const startedAt = performance.now()
  // The collection pass's files (`medusa build` only): left out of the bundle
  const bundleDir = path.join(medusaDist, "commands/utils/bundle") + path.sep
  const isBuildOnlyCommand = createBuildOnlyCommandMatcher(medusaDist)
  const esbuild = require("esbuild")

  const {
    manifest,
    kept,
    moduleDirs,
    pluginDirs,
    resolutions,
    reads,
    loaded,
    configured,
  } = await collect()
  logger.info(
    `Collected build manifest: ${
      Object.keys(manifest.routes ?? {}).length
    } routes, ${Object.keys(manifest.workflows ?? {}).length} workflows, ${
      Object.keys(manifest.lazyModules ?? {}).length
    } lazy modules`
  )
  logger.debug(`Kept eager: ${JSON.stringify(kept)}`)

  const nodeModulesRoot = findNodeModulesRoot(directory)
  const toKey = createPathKeys({ appRoot: outDir, nodeModulesRoot })

  const unusedModules = findUnusedModuleEntries({
    medusaDist,
    loaded,
    configured,
  })
  if (Object.keys(unusedModules).length) {
    logger.debug(
      `Left out of the bundle (not in the configuration): ${Object.values(
        unusedModules
      ).join(", ")}`
    )
  }

  // Everything that can be loaded by path at runtime: the whole app (routes,
  // jobs, instrumentation, ...), each module's package (providers, loaders),
  // and whatever else the collection pass loaded
  const registry = new Map<string, string>()
  const registrable = createRegistrable({ unusedModules, bundleDir })
  const add = (file: string) => {
    if (registrable(file)) {
      registry.set(toKey(file), file)
    }
  }
  // Every first-party package the collection pass touched (modules resolve
  // through re-export files, so their packages show up here)
  const medusaPackageDists = new Set<string>()
  for (const file of loaded) {
    const root = findPackageRoot(file)
    if (root && readPackageName(root)?.startsWith("@medusajs/")) {
      medusaPackageDists.add(packageDistOf(root))
    }
  }
  const dirs = new Set([
    outDir,
    ...moduleDirs.map(packageDistOf),
    ...medusaPackageDists,
  ])
  const addDir = (dir: string) => scanDirectory(dir, add)
  dirs.forEach(addDir)
  loaded.forEach(add)

  // Packages first-party code loads or resolves by name only under some
  // configurations (e.g. the DynamoDB session store, or the package behind a
  // `@medusajs/medusa/<module>` entry the run-time environment enables): the
  // collection pass runs with the build's configuration, so bundle them even
  // if it didn't load them. They're resolved from the file naming them, as
  // Node would: at run time that file may not be able to (a pnpm install only
  // links a package's dependencies next to the package itself).
  //
  // A first-party package found this way is a module or provider the build's
  // configuration didn't enable (S3 or RBAC on Medusa Cloud, the Redis
  // modules): its whole folder is bundled like a loaded module's, as loading
  // it scans that folder for models, services, loaders and migrations.
  const scanned = new Set<string>()
  for (;;) {
    const files = [...registry.values()].filter((file) => !scanned.has(file))
    if (!files.length) {
      break
    }
    files.forEach((file) => scanned.add(file))
    for (const file of files) {
      if (
        !file.endsWith(".js") ||
        !readPackageName(findPackageRoot(file) ?? "")?.startsWith("@medusajs/")
      ) {
        continue
      }
      for (const request of packagesResolvedByName(
        readFileSync(file, "utf8")
      )) {
        if (request in resolutions) {
          continue
        }
        try {
          const resolved = createRequire(file).resolve(request)
          resolutions[request] = resolved
          add(resolved)
          const root = findPackageRoot(resolved)
          if (root && readPackageName(root)?.startsWith("@medusajs/")) {
            const dist = packageDistOf(root)
            if (!dirs.has(dist)) {
              dirs.add(dist)
              addDir(dist)
            }
          }
        } catch {
          // Not installed: an optional dependency this app doesn't use
        }
      }
    }
  }

  // What boot looks up on disk outside the app, answered from the bundle: the
  // directory trees of bundled packages (names only, the code is bundled),
  // small files read at runtime, and package resolutions
  const directories: Record<string, [string, boolean][]> = {}
  const snapshotTree = (dir: string) => {
    const entries = readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.name !== "node_modules")
      .map((entry) => [entry.name, entry.isDirectory()] as [string, boolean])
    directories[toKey(dir)] = entries
    for (const [name, isDirectory] of entries) {
      if (isDirectory) {
        snapshotTree(path.join(dir, name))
      }
    }
  }
  // Bundled first-party packages and plugins (their folders are scanned for
  // resources), outside the app itself
  const packageRoots = new Set(
    [...dirs, ...pluginDirs]
      .filter((dir) => dir !== outDir && !dir.startsWith(outDir + path.sep))
      .map((dir) => findPackageRoot(path.join(dir, "x")) ?? dir)
  )
  packageRoots.forEach(snapshotTree)

  // Small files read at runtime, plus the package.json of every bundled
  // package (read for versions, e.g. by instrumentation)
  const bundledPackageJsons = new Set<string>()
  for (const file of registry.values()) {
    const root = findPackageRoot(file)
    if (root && !root.startsWith(outDir)) {
      bundledPackageJsons.add(path.join(root, "package.json"))
    }
  }
  // Node's module loader reads every module it loads with fs too: those are
  // bundled as code, not embedded again as text. JSON is the exception: the
  // same file can be both required and read with fs (a plugin's package.json
  // is required by tooling and read by the plugin resolver), so it is kept
  // as text as well.
  const registeredFiles = new Set(registry.values())
  const files: Record<string, string> = {}
  for (const file of [...reads, ...bundledPackageJsons]) {
    if (registeredFiles.has(file) && !file.endsWith(".json")) {
      continue
    }
    if (existsSync(file) && statSync(file).size < 512 * 1024) {
      files[toKey(file)] = readFileSync(file, "utf8")
    }
  }

  // Packages first-party code resolves by name depending on the runtime
  // configuration (e.g. `@medusajs/medusa/locking-redis` once Redis is
  // configured): answer every specifier the bundled @medusajs packages
  // export, so a bundle resolves them without node_modules
  addPackageExportResolutions(new Set(registry.values()), resolutions)

  const resolutionKeys = Object.fromEntries(
    Object.entries(resolutions)
      .filter(([, file]) => path.isAbsolute(file))
      .map(([request, file]) => [request, toKey(file)])
  )

  const startFile = path.join(medusaDist, "commands/start.js")
  const migrateFiles = {
    "db:migrate": path.join(medusaDist, "commands/db/migrate.js"),
    "db:migrate:scripts": path.join(medusaDist, "commands/db/run-scripts.js"),
    "db:migrate:search": path.join(medusaDist, "commands/db/migrate-search.js"),
  }
  const globalSetupFiles = [...registry.values()].filter(
    (file) =>
      file.endsWith(".js") &&
      readPackageName(findPackageRoot(file) ?? "")?.startsWith("@medusajs/") &&
      SIDE_EFFECT.test(readFileSync(file, "utf8"))
  )

  const entryFile = path.join(outDir, "__medusa-entry.js")
  const transform = createTransforms({
    outDir,
    entryFile,
    toKey,
    isBuildOnlyCommand,
  })

  await writeFile(
    entryFile,
    createEntry({
      manifest: keyManifest(manifest, toKey),
      registry,
      startFile,
      migrateFiles,
      globalSetupFiles,
      // In key order: the collection pass loads modules concurrently, so the
      // order these were found in changes from one build to the next
      directories: sortKeys(directories),
      files: sortKeys(files),
      resolutions: resolutionKeys,
      unbundled: Object.fromEntries(
        Object.entries(unusedModules).map(([file, name]) => [toKey(file), name])
      ),
      medusaDist,
    })
  )

  const buildOptions = {
    // Which files were compiled in, to tell what still has to be on disk
    metafile: true,
    bundle: true,
    platform: "node",
    format: "cjs",
    // The build runs on the Node version that runs the app (e.g. the same
    // Docker image)
    target: `node${process.versions.node.split(".")[0]}`,
    minifySyntax: true,
    minifyWhitespace: true,
    // A smaller file is faster to load and parse. Names stay as written
    // (keepNames): Medusa reads class and function names at runtime.
    minifyIdentifiers: true,
    keepNames: true,
    legalComments: "none",
    // import() becomes require(), so every load goes through the entry's
    // loader hook (bundled lookups, external keys)
    supported: { "dynamic-import": false },
    logLevel: "error",
  }
  const bundledFiles = new Set<string>()
  const collectInputs = (result: any) => {
    for (const input of Object.keys(result.metafile.inputs)) {
      bundledFiles.add(path.resolve(input))
    }
  }
  try {
    collectInputs(
      await esbuild.build({
        ...buildOptions,
        entryPoints: [entryFile],
        outfile: path.join(outDir, MAIN_FILE_NAME),
        plugins: [transform.externals(), transform.sources],
      })
    )
  } finally {
    rmSync(entryFile, { force: true })
  }

  const vendored = vendorPackages(transform.vendorRoots, outDir)
  if (vendored.length) {
    logger.info(`Copied packages that can't be bundled: ${vendored.join(", ")}`)
  }

  // Left out on purpose: not traced either, or the trace would copy them (and
  // everything they import) next to the bundle as plain files
  const leftOut = (file: string) =>
    file in unusedModules ||
    file.startsWith(bundleDir) ||
    isBuildOnlyCommand(file) ||
    FIRST_PARTY_TEST_FILE.test(file)
  const traced = await copyTracedFiles({
    entries: [...registry.values()].filter(
      (file) => /\.(c|m)?js$/.test(file) && !leftOut(file)
    ),
    leftOut,
    bundled: bundledFiles,
    // Every module the build compiled is in the registry, by key
    addressable: new Set(registry.values()),
    outDir,
    nodeModulesRoot,
    directory,
  })
  if (traced.files) {
    logger.info(
      `Copied ${traced.files} files the bundle loads from disk (${(
        traced.bytes / 1e6
      ).toFixed(1)} MB)`
    )
  }

  await writeFile(path.join(outDir, BUNDLE_FILE_NAME), LAUNCHER)

  logger.info(
    `Bundled backend into ${BUNDLE_FILE_NAME}: ${registry.size} modules (${(
      (performance.now() - startedAt) /
      1000
    ).toFixed(1)}s)`
  )
}

function sortKeys<T>(record: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(record).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  )
}
