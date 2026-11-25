import { BuildManifest } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import { fork } from "child_process"
import {
  copyFileSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  Stats,
  statSync,
  symlinkSync,
} from "fs"
import { mkdtemp, readFile, writeFile } from "fs/promises"
import Module, { createRequire } from "module"
import { createHash } from "crypto"
import os from "os"
import path from "path"
import { createPathKeys, RUNTIME_PATH_KEYS } from "./paths"

/**
 * The bundle's file name and first line. `medusa start` only runs a file that
 * has both, so a project's own `server.ts` (compiled into the build output)
 * is never mistaken for a bundle.
 */
export const BUNDLE_FILE_NAME = "medusa-bundle.js"
export const BUNDLE_MARKER = "/* @medusajs/medusa bundle */"
const MAIN_FILE_NAME = "medusa-bundle.main.js"
// Modules loaded on first use, one file each, and their index (key -> file)
const COLD_DIR = "medusa-bundle.cold"
const COLD_INDEX = `${COLD_DIR}/index.json`
const COMPILE_CACHE_DIR = ".medusa-compile-cache"

/**
 * Requires of external files resolved at build time are written as this
 * prefix plus the file's key; the entry maps them to where they're deployed.
 */
const EXTERNAL_PREFIX = "medusa-key:"

/**
 * esbuild ships with Vite, which ships with the admin bundler.
 */
function loadEsbuild() {
  const bundlerEntry = require.resolve("@medusajs/admin-bundler")
  const viteEntry = createRequire(bundlerEntry).resolve("vite")
  return createRequire(viteEntry)("esbuild")
}

/**
 * Runs the collection pass in its own process, from the compiled output.
 */
async function collect(outDir: string) {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "medusa-collect-"))
  const outputFile = path.join(tmp, "collected.json")
  try {
    await new Promise<void>((resolve, reject) => {
      // The child's stdout is kept to report when it fails, and dropped when
      // it succeeds. stderr goes straight to ours.
      const stdout: Buffer[] = []
      const child = fork(
        path.join(__dirname, "collect-runner.js"),
        [outputFile],
        {
          cwd: outDir,
          // Collect what production boots, whatever mode the build runs in
          env: { ...process.env, NODE_ENV: "production" },
          stdio: ["ignore", "pipe", "inherit", "ipc"],
        }
      )
      child.stdout?.on("data", (chunk: Buffer) => stdout.push(chunk))
      child.on("error", reject)
      child.on("exit", (code) => {
        if (code === 0) {
          return resolve()
        }
        const output = Buffer.concat(stdout).toString("utf8").trim()
        reject(
          new Error(
            `Collecting the build manifest failed (exit ${code})` +
              (output ? `\nOutput of the collection pass:\n${output}` : "")
          )
        )
      })
    })
    return JSON.parse(await readFile(outputFile, "utf8")) as {
      manifest: BuildManifest
      kept: Record<string, string>
      moduleDirs: string[]
      /** Every `resolve` named in the app's configuration */
      configured: string[]
      pluginDirs: string[]
      resolutions: Record<string, string>
      reads: string[]
      loaded: string[]
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

/**
 * Rewrites every file path in the manifest to its relocatable key.
 */
function keyManifest(manifest: BuildManifest, toKey: (file: string) => string) {
  const rekey = <T>(record?: Record<string, T>) =>
    record &&
    Object.fromEntries(
      Object.entries(record).map(([file, v]) => [toKey(file), v])
    )

  return {
    ...manifest,
    routes: rekey(manifest.routes),
    subscribers: rekey(manifest.subscribers),
    middlewares: rekey(manifest.middlewares),
    workflows:
      manifest.workflows &&
      Object.fromEntries(
        Object.entries(manifest.workflows).map(([id, file]) => [
          id,
          toKey(file),
        ])
      ),
    lazyWorkflowFiles: manifest.lazyWorkflowFiles?.map(toKey),
    workflowHooks:
      manifest.workflowHooks &&
      Object.fromEntries(
        Object.entries(manifest.workflowHooks).map(([id, files]) => [
          id,
          files.map(toKey),
        ])
      ),
  }
}

/**
 * The bundle's entry: resolves the manifest's keys for where the bundle
 * runs, routes requires of bundled files to the bundled modules (files
 * loaded by path at runtime, like routes, are looked up by key), and starts
 * the server.
 */
function createEntry({
  manifest,
  registry,
  startFile,
  migrateFiles,
  globalSetupFiles,
  directories,
  files,
  resolutions,
  unbundled,
}: {
  manifest: unknown
  registry: Map<string, string>
  startFile: string
  /** The `db:migrate*` commands' modules, by command name */
  migrateFiles: Record<string, string>
  globalSetupFiles: string[]
  directories: Record<string, [string, boolean][]>
  files: Record<string, string>
  resolutions: Record<string, string>
  /** Module entry files left out of the bundle, by key, with their name */
  unbundled: Record<string, string>
}) {
  // dotenv as Medusa resolves it (the app itself may not depend on it)
  const dotenvFile = createRequire(
    require.resolve("@medusajs/framework")
  ).resolve("dotenv")
  const entries = [...registry]
    .map(
      ([key, file]) =>
        `__r.set(${JSON.stringify(key)}, () => require(${JSON.stringify(
          file
        )}));`
    )
    .join("\n")

  return `${RUNTIME_BOOT_PROFILE}
${RUNTIME_PATH_KEYS}
${RUNTIME_VIRTUAL_FS}
${RUNTIME_MISSING_MODULE_HINT}
// Required directly by another program (e.g. a test runner) rather than run
// through the launcher: expose the bundle's modules and run nothing. The
// host's own code reads the same files from disk, so the virtual fs (which
// answers for bundled packages' folders) stays off.
var __library = !globalThis.__MEDUSA_BUNDLE_COMMAND__ && require.main !== module;
if (__library) {
  // Nothing is virtual: lookups fall through to the disk
  globalThis.__medusaVirtualKind = () => undefined;
  globalThis.__medusaVirtualRead = () => undefined;
} else {
  __medusaInstallVirtualFs(${JSON.stringify(directories)}, ${JSON.stringify(
    files
  )});
}
var __resolutions = ${JSON.stringify(resolutions)};
var __unbundled = ${JSON.stringify(unbundled)};
var __m = ${JSON.stringify(manifest)};
var __toPath = __medusaKeyToPath;
var __repath = (record) => record && Object.fromEntries(Object.entries(record).map(([k, v]) => [__toPath(k), v]));
globalThis.__MEDUSA_BUILD_MANIFEST__ = Object.assign({}, __m, {
  routes: __repath(__m.routes),
  subscribers: __repath(__m.subscribers),
  middlewares: __repath(__m.middlewares),
  workflows: __m.workflows && Object.fromEntries(Object.entries(__m.workflows).map(([id, f]) => [id, __toPath(f)])),
  lazyWorkflowFiles: __m.lazyWorkflowFiles && __m.lazyWorkflowFiles.map(__toPath),
  workflowHooks: __m.workflowHooks && Object.fromEntries(Object.entries(__m.workflowHooks).map(([id, fs]) => [id, fs.map(__toPath)])),
});

var __Module = require("module");
var __path = require("path");
var __r = new Map();
${entries}
// Modules loaded on first use (see COLD_DIR): one file each, required when the
// registry is first asked for them
var __coldProfile = globalThis.__MEDUSA_BOOT_EVAL_PROFILE__ && globalThis.__MEDUSA_BOOT_EVAL_PROFILE__.coldLoads;
try {
  var __cold = JSON.parse(require("fs").readFileSync(__path.join(__medusaAppRoot, ${JSON.stringify(
    COLD_INDEX
  )}), "utf8"));
  for (var __coldKey in __cold) {
    if (!__r.has(__coldKey)) {
      __r.set(__coldKey, ((file) => {
        var load = () => {
          if (!__coldProfile) return require(file);
          var outer = __coldProfile.depth++ === 0, startedAt = performance.now();
          var first = !require.cache[file];
          try { return require(file); } finally {
            __coldProfile.depth--;
            if (first) __coldProfile.count++;
            // Nested loads are part of the outer one's time
            if (first && outer) __coldProfile.ms += performance.now() - startedAt;
          }
        };
        // A plain require of the module's own file: Node's module cache
        // handles require cycles through it, so it's safe to re-enter
        load.reentrant = true;
        return load;
      })(__path.join(__medusaAppRoot, __cold[__coldKey])));
    }
  }
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
var __lookup = (file) => {
  var key = __medusaPathToKey(file);
  return __r.get(key) || __r.get(key + ".js") || __r.get(key + ".json") || __r.get(__medusaPathToKey(__path.join(file, "index.js")));
};
// Requires and require.resolve() made by bundled code: answer package
// specifiers from the build's resolution table, and virtual paths as is
var __resolveFilename = __Module._resolveFilename;
var __hasResolution = (request) => Object.prototype.hasOwnProperty.call(__resolutions, request);
var __bundledCandidate = (base) => {
  for (var candidate of [base, base + ".js", base + ".json", __path.join(base, "index.js")]) {
    if (__lookup(candidate) || __medusaVirtualKind(candidate) === "file") return candidate;
  }
};
__Module._resolveFilename = function (request, parent) {
  // A package the build resolved is answered from the bundle before the disk,
  // for every bundled file (including the requires made for one through
  // __medusaRequireFrom). Run inside the project it was built from, the disk
  // also has the package installed: resolving there first would load a second
  // copy of it next to the bundled one.
  if (
    parent && parent.filename && __hasResolution(request) &&
    (parent.filename === __filename || __lookup(parent.filename))
  ) {
    return __medusaKeyToPath(__resolutions[request]);
  }
  if (parent && parent.filename === __filename) {
    if (__path.isAbsolute(request)) {
      var bundled = __bundledCandidate(request);
      if (bundled) return bundled;
    }
  }
  try {
    return __resolveFilename.apply(this, arguments);
  } catch (error) {
    // Bundled files needn't exist on disk: resolve paths against the bundle
    if (parent && parent.filename && !__Module.isBuiltin(request)) {
      var base = __path.isAbsolute(request)
        ? request
        : request.startsWith(".")
          ? __path.resolve(__path.dirname(parent.filename), request)
          : null;
      var found = base ? __bundledCandidate(base) : undefined;
      if (found) return found;
      if (!base && __hasResolution(request)) return __medusaKeyToPath(__resolutions[request]);
      if (parent.filename === __filename || __lookup(parent.filename) || __medusaVirtualKind(parent.filename)) {
        __medusaAddMissingModuleHint(error, request);
      }
    }
    throw error;
  }
};
// A require for a bundled file's original location (see keepIdentity)
var __requireFrom = new Map();
globalThis.__medusaRequireFrom = (file) => {
  var req = __requireFrom.get(file);
  if (!req) {
    req = __Module.createRequire(file);
    __requireFrom.set(file, req);
  }
  return req;
};
var __loading = new Set();
var __load = __Module._load;
__Module._load = function (request, parent, isMain) {
  if (request.startsWith(${JSON.stringify(EXTERNAL_PREFIX)})) {
    request = __medusaKeyToPath(request.slice(${EXTERNAL_PREFIX.length}));
    arguments[0] = request;
  }
  if (!__Module.isBuiltin(request)) {
    var json = __path.isAbsolute(request) && request.endsWith(".json") && __medusaVirtualRead(request);
    if (json) return JSON.parse(json);
    var hit = __path.isAbsolute(request) ? __lookup(request) : undefined;
    if (!hit) {
      try { hit = __lookup(__Module._resolveFilename(request, parent, isMain)); } catch (e) {}
    }
    // A module the build left out because the configuration it saw didn't use
    // it. Where the app's packages are installed, the disk has it: loading it
    // from there would run a second copy of the framework next to the bundled
    // one, so say what to do instead.
    if (!hit) {
      var target = request;
      if (!__path.isAbsolute(target)) {
        try { target = __Module._resolveFilename(request, parent, isMain); } catch (e) { target = undefined; }
      }
      // Also by its path inside whichever node_modules it was found in: run
      // inside the project, that is the project's, not the bundle's
      var inPackages = target ? target.lastIndexOf(__path.sep + "node_modules" + __path.sep) : -1;
      var left = target && (__unbundled[__medusaPathToKey(target)] ||
        (inPackages !== -1 && __unbundled["nm:" + target.slice(inPackages + 14)]));
      if (left) {
        throw new Error("'" + left + "' is not in this bundle: the configuration 'medusa build --bundle' saw did not use it. Enable it in the configuration the build sees and build again.");
      }
    }
    // Entries left external are plain requires: don't loop back here. Cold
    // modules are safe to re-enter (a require cycle through them).
    if (hit && (hit.reentrant || !__loading.has(hit))) {
      __loading.add(hit);
      try { return hit(); } finally { __loading.delete(hit); }
    }
  }
  return __load.apply(this, arguments);
};

// Modules that set up globals when loaded (e.g. global.MedusaModule, which
// defineLink uses). Unbundled, importing the framework loads them; lazy
// re-exports would defer them, so load them before anything runs.
${globalSetupFiles
  .map((file) => `require(${JSON.stringify(file)});`)
  .join("\n")}

if (__library) {
  module.exports = {
    // Loads a module as bundled code does (package specifiers and paths)
    require: (request) => require(request),
    directory: __medusaAppRoot,
  };
} else {
process.chdir(__medusaAppRoot);
require(${JSON.stringify(
    dotenvFile
  )}).config(process.env.MEDUSA_ENV_FILE ? { path: process.env.MEDUSA_ENV_FILE } : {});

// Set by the launcher (${BUNDLE_FILE_NAME}): the command and its parsed flags
var __command = globalThis.__MEDUSA_BUNDLE_COMMAND__ || { name: "start", args: {} };
var __args = __command.args;
var __migrateFiles = {
${Object.entries(migrateFiles)
  .map(
    ([command, file]) =>
      `  ${JSON.stringify(command)}: () => require(${JSON.stringify(file)}),`
  )
  .join("\n")}
};
if (__migrateFiles[__command.name]) {
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  __migrateFiles[__command.name]().default(Object.assign({ directory: process.cwd() }, __args));
} else {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";
  require(${JSON.stringify(startFile)}).default(Object.assign({
    directory: process.cwd(),
    port: __args.port || process.env.PORT || "9000",
    host: __args.host || process.env.HOST,
    types: false,
    workers: __args.workers || "0",
    servers: __args.servers || "0",
  }, "cluster" in __args ? { cluster: __args.cluster } : {}));
}
}
`
}

/**
 * Bundles the compiled backend in `outDir` into a single file, using what the
 * collection pass found to make boot evaluate as little as possible:
 *
 * - routes, middlewares, subscribers, workflows and hooks load on first use
 * - modules boot doesn't need load on first use
 * - re-export files and package imports in first-party code are lazy
 * - file identity (`__filename`, `defineFileConfig`, ...) survives bundling
 */
export async function bundleBackend({
  directory,
  outDir,
  logger,
}: {
  directory: string
  outDir: string
  logger: Logger
}) {
  const startedAt = performance.now()
  const esbuild = loadEsbuild()

  const {
    manifest,
    kept,
    moduleDirs,
    pluginDirs,
    resolutions,
    reads,
    loaded,
    configured,
  } = await collect(outDir)
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

  const unusedModules = findUnusedModuleEntries({ loaded, configured })
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
  const registrable = (file: string) => {
    if (!/\.(c|m)?js$|\.json$/.test(file) || file.endsWith(".d.ts")) {
      return false
    }
    // Build tooling the collection pass happened to load isn't needed to run
    const root = findPackageRoot(file)
    const name = root ? readPackageName(root) : undefined
    if (name && BUILD_TOOLING.test(name)) {
      return false
    }
    // The bundler itself (this folder), which only `medusa build` runs
    if (file.startsWith(__dirname + path.sep)) {
      return false
    }
    if (file in unusedModules) {
      return false
    }
    // Scanned folders can hold JSON with comments (e.g. tsconfig.json),
    // which nothing can require
    if (file.endsWith(".json") && !isRequirableJson(file)) {
      return false
    }
    return true
  }
  const add = (file: string) => {
    if (registrable(file)) {
      registry.set(toKey(file), file)
    }
  }
  const skipDir =
    /[\\/](node_modules|__tests__|__fixtures__|__mocks__|integration-tests|public)([\\/]|$)/
  // A plugin's admin extensions (src/admin in its build output): browser code
  // that is compiled into the admin build, and never loaded by the server
  const adminExtensions =
    /(^|[\\/]\.medusa[\\/]server)[\\/]src[\\/]admin([\\/]|$)/
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
  const addDir = (dir: string) => {
    for (const file of readdirSync(dir, { recursive: true } as any)) {
      const absolute = path.join(dir, String(file))
      if (
        !skipDir.test(absolute.slice(dir.length)) &&
        !adminExtensions.test(absolute.slice(dir.length)) &&
        !absolute.includes(COMPILE_CACHE_DIR) &&
        ![BUNDLE_FILE_NAME, MAIN_FILE_NAME].includes(path.basename(absolute))
      ) {
        add(absolute)
      }
    }
  }
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

  const startFile = path.join(__dirname, "../../start.js")
  const migrateFiles = {
    "db:migrate": path.join(__dirname, "../../db/migrate.js"),
    "db:migrate:scripts": path.join(__dirname, "../../db/run-scripts.js"),
    "db:migrate:search": path.join(__dirname, "../../db/migrate-search.js"),
  }
  const globalSetupFiles = [...registry.values()].filter(
    (file) =>
      file.endsWith(".js") &&
      readPackageName(findPackageRoot(file) ?? "")?.startsWith("@medusajs/") &&
      SIDE_EFFECT.test(readFileSync(file, "utf8"))
  )

  // Hot: what the collection pass evaluated (a superset of what boot runs),
  // bundled into the main file. Cold: everything else, built as one file per
  // module and loaded on first use, so boot only parses what it may run.
  // MEDUSA_BUNDLE_SPLIT=false bundles everything into the main file.
  const split = process.env.MEDUSA_BUNDLE_SPLIT !== "false"
  const hotFiles = new Set<string>(
    split
      ? [
          ...loaded,
          ...globalSetupFiles,
          startFile,
          ...Object.values(migrateFiles),
        ].filter(registrable)
      : registry.values()
  )
  const entryFile = path.join(outDir, "__medusa-entry.js")
  const transform = createTransforms({ outDir, entryFile, toKey })
  if (split) {
    // What starting the server imports before modules load (the app's
    // instrumentation, the start command), which the collection pass never
    // evaluates: hot, with everything they import
    const bootRoots = [startFile, path.join(outDir, "instrumentation.js")].filter(
      (file) => existsSync(file)
    )
    const analysis = await esbuild.build({
      entryPoints: bootRoots,
      bundle: true,
      write: false,
      metafile: true,
      outdir: os.tmpdir(),
      platform: "node",
      format: "cjs",
      logLevel: "silent",
      // The same transforms as the bundle (e.g. computed requires), so the
      // analysis sees the same imports
      plugins: [transform.externals(), transform.sources],
    })
    for (const input of Object.keys(analysis.metafile.inputs)) {
      const file = path.resolve(input)
      if (registrable(file)) {
        hotFiles.add(file)
      }
    }
  }
  const hotRegistry = new Map<string, string>()
  for (const file of hotFiles) {
    hotRegistry.set(toKey(file), file)
  }
  const coldPending = new Set(
    [...registry.values()].filter((file) => !hotFiles.has(file))
  )

  await writeFile(
    entryFile,
    createEntry({
      manifest: keyManifest(manifest, toKey),
      registry: hotRegistry,
      startFile,
      migrateFiles,
      globalSetupFiles,
      directories,
      files,
      resolutions: resolutionKeys,
      unbundled: Object.fromEntries(
        Object.entries(unusedModules).map(([file, name]) => [toKey(file), name])
      ),
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
        plugins: [
          transform.externals(
            split
              ? {
                  inline: (file) => hotFiles.has(file),
                  onExternal: (file) => coldPending.add(file),
                }
              : undefined
          ),
          transform.sources,
        ],
      })
    )
  } finally {
    rmSync(entryFile, { force: true })
  }
  transform.forgetSources()

  // Cold modules, one file each: every import they make goes through the
  // registry, so each module exists once (here or in the main file). Built in
  // rounds, as each round finds the modules the previous one imports.
  const coldFiles = new Map<string, string>()
  while (coldPending.size) {
    const entryPoints: Record<string, string> = {}
    for (const file of coldPending) {
      if (!coldFiles.has(file) && !hotFiles.has(file)) {
        const name = createHash("sha1")
          .update(toKey(file))
          .digest("hex")
          .slice(0, 16)
        coldFiles.set(file, `${COLD_DIR}/${name}.js`)
        // JSON is written as a module directly: built as an entry point,
        // esbuild turns its keys into named exports, which the CommonJS
        // output only declares (the file would export nothing)
        if (file.endsWith(".json")) {
          mkdirSync(path.join(outDir, COLD_DIR), { recursive: true })
          await writeFile(
            path.join(outDir, COLD_DIR, `${name}.js`),
            coldJsonModule(await readFile(file, "utf8"))
          )
          bundledFiles.add(file)
          continue
        }
        entryPoints[name] = file
      }
    }
    coldPending.clear()
    if (!Object.keys(entryPoints).length) {
      break
    }
    collectInputs(
      await esbuild.build({
        ...buildOptions,
        entryPoints,
        outdir: path.join(outDir, COLD_DIR),
        plugins: [
          transform.externals({
            inline: () => false,
            onExternal: (file) => {
              if (!hotFiles.has(file) && !coldFiles.has(file)) {
                coldPending.add(file)
              }
            },
          }),
          transform.sources,
        ],
      })
    )
  }
  if (coldFiles.size) {
    await writeFile(
      path.join(outDir, COLD_INDEX),
      JSON.stringify(
        Object.fromEntries(
          [...coldFiles].map(([file, out]) => [toKey(file), out])
        )
      )
    )
  }

  const vendored = vendorPackages(transform.vendorRoots, outDir)
  if (vendored.length) {
    logger.info(`Copied packages that can't be bundled: ${vendored.join(", ")}`)
  }

  // Left out on purpose: not traced either, or the trace would copy them (and
  // everything they import) next to the bundle as plain files
  const leftOut = (file: string) =>
    file in unusedModules ||
    file.startsWith(__dirname + path.sep) ||
    isBuildOnlyCommand(file) ||
    FIRST_PARTY_TEST_FILE.test(file)
  const traced = await copyTracedFiles({
    entries: [...registry.values()].filter(
      (file) => /\.(c|m)?js$/.test(file) && !leftOut(file)
    ),
    leftOut,
    bundled: bundledFiles,
    // Every module the build compiled is in the registry, by key
    addressable: new Set([
      ...registry.values(),
      ...hotFiles,
      ...coldFiles.keys(),
    ]),
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
    `Bundled backend into ${BUNDLE_FILE_NAME}: ${
      hotFiles.size
    } modules at boot, ${coldFiles.size} loaded on first use (${(
      (performance.now() - startedAt) /
      1000
    ).toFixed(1)}s)`
  )
}

// Packages only `medusa build` and `medusa develop` use (bundlers, compilers,
// the linter the build runs). The commands that require them stay in the
// bundle, since they are reachable from the package entry, but never run from
// one.
const BUILD_TOOLING =
  /^(vite|rollup|esbuild|ts-node|typescript|tailwindcss|postcss|autoprefixer|lightningcss|eslint|jiti|@medusajs\/admin-vite-plugin|@medusajs\/eslint-plugin|@vercel\/nft)(\/|$)|^(@vitejs|@rollup|@esbuild|@swc|@tailwindcss|@eslint|@eslint-community|@typescript-eslint)\//

/**
 * Commands that build or scaffold a project. They are reachable from the
 * package entry, so their files stay addressable, but a bundle only ever runs
 * `start` and the `db:migrate` commands: compiled in as a stub, they don't
 * bring their dependencies (the linter, the bundler, project scaffolding).
 */
const BUILD_ONLY_COMMANDS = (() => {
  const commands = path.resolve(__dirname, "../..")
  const files = ["build", "develop", "lint"].map((name) =>
    path.join(commands, name + ".js")
  )
  const dirs = [path.join(commands, "plugin") + path.sep]
  try {
    const cli = findPackageRoot(require.resolve("@medusajs/cli"))
    if (cli) {
      dirs.push(path.join(cli, "dist", "commands") + path.sep)
    }
  } catch {
    // Not resolvable from here: nothing of it to stub
  }
  return { files: new Set(files), dirs }
})()
function isBuildOnlyCommand(file: string): boolean {
  return (
    BUILD_ONLY_COMMANDS.files.has(file) ||
    (file.endsWith(".js") &&
      BUILD_ONLY_COMMANDS.dirs.some((dir) => file.startsWith(dir)))
  )
}
const BUILD_ONLY_COMMAND_STUB = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function () {
  throw new Error("This command can't run from a bundled build (medusa build --bundle). Run it in the project, with the Medusa CLI.");
};
`

/**
 * The module and provider entry files of `@medusajs/medusa` (its
 * `dist/modules/<name>.js` re-exports) this app has no use for, by file, with
 * the name they are imported by. Each one would bring a whole package and its
 * dependencies into the bundle.
 *
 * Kept: what the collection pass loaded, what the configuration names, and
 * what the framework itself selects by environment (the Redis modules once
 * REDIS_URL is set, their in-memory counterparts without it), since that can
 * differ between the build and the running app.
 */
function findUnusedModuleEntries({
  loaded,
  configured,
}: {
  loaded: string[]
  configured: string[]
}): Record<string, string> {
  const modulesDir = path.resolve(__dirname, "../../../modules")
  // Named by the framework's own defaults, whatever the environment
  const defaults = new Set<string>()
  try {
    const utilsDist = path.dirname(require.resolve("@medusajs/utils"))
    for (const file of [
      path.join(utilsDist, "common", "define-config.js"),
      path.join(utilsDist, "modules-sdk", "definition.js"),
    ]) {
      for (const [, name] of readFileSync(file, "utf8").matchAll(
        /["']@medusajs\/medusa\/([\w-]+)["']/g
      )) {
        defaults.add(name)
      }
    }
  } catch {
    // The defaults can't be read: leave every module in
    return {}
  }
  if (!defaults.size || !existsSync(modulesDir)) {
    return {}
  }
  const used = new Set([...loaded, ...configured])
  const unused: Record<string, string> = {}
  for (const entry of readdirSync(modulesDir)) {
    if (!entry.endsWith(".js")) {
      continue
    }
    const name = entry.slice(0, -3)
    const file = path.join(modulesDir, entry)
    if (
      !defaults.has(name) &&
      !used.has(file) &&
      !used.has("@medusajs/medusa/" + name) &&
      !used.has("@medusajs/" + name)
    ) {
      unused[file] = "@medusajs/medusa/" + name
    }
  }
  return unused
}

// Tests and fixtures first-party packages publish in their dist
const FIRST_PARTY_TEST_FILE =
  /[\\/]@medusajs[\\/][^\\/]+[\\/].*[\\/](__tests__|__fixtures__|__mocks__|integration-tests)[\\/]/

const LAZY_HELPER = `var __lazyReq = (load) => { let m; const get = () => (m ??= load()); return new Proxy({}, { get: (_, k) => get()[k], has: (_, k) => k in get(), ownKeys: () => Reflect.ownKeys(get()), getOwnPropertyDescriptor: (_, k) => { const d = Reflect.getOwnPropertyDescriptor(get(), k); if (d) d.configurable = true; return d; }, set: (_, k, v) => { get()[k] = v; return true; } }); };`
const LAZY_REQUIRE =
  /^(const|var|let) ([A-Za-z_$][\w$]*) = (__importDefault\(|__importStar\()?require\("([^"]+)"\)\)?;$/gm
const NEVER_LAZY =
  /^(@sentry\/|@opentelemetry\/|@medusajs\/framework$|@medusajs\/framework\/(utils|types)$|reflect-metadata|dotenv|source-map-support)/
const STAR = /^__exportStar\(require\("([^"]+)"\), exports\);$/
const NAMESPACE =
  /^exports\.([A-Za-z_$][\w$]*) = __importStar\(require\("([^"]+)"\)\);$/
const VOID = /^(exports\.[A-Za-z_$][\w$]* = )+void 0;$/
// `require(x)` whose argument isn't a single string literal, and
// `require.resolve(`, as calls (not `.require(` or `typeof require`)
const COMPUTED_REQUIRE =
  /(?<![\w$.])require\s*\((?!\s*(["'])[^"'\\\n]*\1\s*\))/g
const REQUIRE_RESOLVE = /(?<![\w$.])require\.resolve\s*\(/g
// A file declaring its own `require` (a parameter or variable)
const SHADOWED_REQUIRE =
  /function\s*[\w$]*\s*\([^)]*\brequire\b[^)]*\)|\b(?:var|let|const)\s+require\b|\(\s*require\s*(?:,[^)]*)?\)\s*=>/
// `dynamicImport("pkg")` (or `(0, utils_1.dynamicImport)("pkg")` once
// compiled) with a package name, not a relative or absolute path
const DYNAMIC_IMPORT_OF_PACKAGE =
  /dynamicImport\)?\(\s*"((?:@[\w.-]+\/)?[a-z0-9][\w./-]*)"\s*\)/g
// `require.resolve("pkg")` with a package name
const REQUIRE_RESOLVE_OF_PACKAGE =
  /(?<![\w$.])require\.resolve\(\s*"((?:@[\w.-]+\/)?[a-z0-9][\w./-]*)"\s*\)/g

/**
 * A JSON file as a first-use module: what `require` of the file returns.
 */
export function coldJsonModule(json: string): string {
  return `module.exports=${JSON.stringify(JSON.parse(json))};`
}

/**
 * The packages a compiled file loads (`dynamicImport`) or resolves
 * (`require.resolve`) by a literal name. Neither is an import the bundler
 * follows, so each is resolved at build time and answered from the bundle.
 */
export function packagesResolvedByName(source: string): string[] {
  return [
    ...source.matchAll(DYNAMIC_IMPORT_OF_PACKAGE),
    ...source.matchAll(REQUIRE_RESOLVE_OF_PACKAGE),
  ].map(([, request]) => request)
}
const SIDE_EFFECT = /^global(This)?\.[A-Za-z_]+ *(\?\?=|=)/m
// A call made at the top level (compiled TypeScript puts top-level statements
// at column 0), other than the module plumbing TypeScript emits: e.g.
// `OrderChangeProcessing.registerActionType(...)`
const TOP_LEVEL_CALL =
  /^(?!Object\.defineProperty\(exports|exports\.|module\.exports|__exportStar\(|__setModuleDefault\(|__createBinding\(|__decorate\(|__metadata\()(?:\(0, )?[A-Za-z_$][\w$]*(?:\.[\w$]+)*\)?\s*\(/m
const ES_MODULE_MARKER =
  'Object.defineProperty(exports, "__esModule", { value: true });'

function createTransforms({
  outDir,
  entryFile,
  toKey,
}: {
  outDir: string
  entryFile: string
  toKey: (file: string) => string
}) {
  const packageNames = new Map<string, string | null>()
  const packageOf = (file: string): string | null => {
    const dir = path.dirname(file)
    if (packageNames.has(dir)) {
      return packageNames.get(dir)!
    }
    let name: string | null = null
    const pkg = path.join(dir, "package.json")
    if (existsSync(pkg)) {
      try {
        name = JSON.parse(readFileSync(pkg, "utf8")).name ?? null
      } catch {}
    } else if (path.dirname(dir) !== dir) {
      name = packageOf(dir)
    }
    packageNames.set(dir, name)
    return name
  }
  const appPrefix = outDir + path.sep
  const isApp = (file: string) =>
    file.startsWith(appPrefix) &&
    !file.includes(`${path.sep}node_modules${path.sep}`)
  const isFirstParty = (file: string) =>
    isApp(file) || !!packageOf(file)?.startsWith("@medusajs/")

  const sideEffects = new Map<string, boolean>()
  const hasSideEffects = (file: string): boolean => {
    if (sideEffects.has(file)) {
      return sideEffects.get(file)!
    }
    sideEffects.set(file, false)
    const src = readFileSync(file, "utf8")
    let result = SIDE_EFFECT.test(src) || TOP_LEVEL_CALL.test(src)
    if (!result) {
      const req = createRequire(file)
      for (const match of src.matchAll(new RegExp(STAR.source, "gm"))) {
        try {
          if (hasSideEffects(req.resolve(match[1]))) {
            result = true
            break
          }
        } catch {}
      }
    }
    sideEffects.set(file, result)
    return result
  }

  /**
   * Re-export files (`export * from`, `export * as x from`) become getters
   * requiring each child on first access. Export names are read here, at
   * build time. Children with global side effects still load eagerly.
   */
  const lazyBarrel = (file: string, src: string) => {
    if (!packageOf(file)?.startsWith("@medusajs/")) {
      return
    }
    const at = src.indexOf(ES_MODULE_MARKER)
    if (at === -1) {
      return
    }
    const lines = src
      .slice(at + ES_MODULE_MARKER.length)
      .replace(/\/\/# sourceMappingURL=.*$/m, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    if (
      !lines.length ||
      !lines.every((l) => STAR.test(l) || NAMESPACE.test(l) || VOID.test(l)) ||
      !lines.some((l) => STAR.test(l) || NAMESPACE.test(l))
    ) {
      return
    }
    const req = createRequire(file)
    const out = [
      src.slice(0, at + ES_MODULE_MARKER.length),
      "var __has = Object.prototype.hasOwnProperty;",
      "var __d = (k, l) => { if (!__has.call(exports, k)) Object.defineProperty(exports, k, { enumerable: true, configurable: true, get: () => l()[k] }); };",
    ]
    lines.forEach((line, i) => {
      let match: RegExpMatchArray | null
      if ((match = line.match(STAR))) {
        const spec = match[1]
        out.push(
          `var __m${i}; var __l${i} = () => __m${i} ??= require(${JSON.stringify(
            spec
          )});`
        )
        for (const key of Object.keys(req(spec))) {
          if (key !== "default" && key !== "__esModule") {
            out.push(`__d(${JSON.stringify(key)}, __l${i});`)
          }
        }
        if (hasSideEffects(req.resolve(spec))) {
          out.push(`__l${i}();`)
        }
      } else if ((match = line.match(NAMESPACE))) {
        const [, name, spec] = match
        out.push(
          `var __n${i}; Object.defineProperty(exports, ${JSON.stringify(
            name
          )}, { enumerable: true, configurable: true, get: () => __n${i} ??= __importStar(require(${JSON.stringify(
            spec
          )})) });`
        )
        if (hasSideEffects(req.resolve(spec))) {
          out.push(`exports.${name};`)
        }
      }
    })
    return out.join("\n")
  }

  /**
   * In first-party code, top-level `const x = require("...")` becomes a proxy
   * requiring on first access: imports only used later (in functions) no
   * longer evaluate at boot.
   */
  const lazyRequires = (file: string, src: string) => {
    if (
      !isFirstParty(file) ||
      file === path.join(outDir, "instrumentation.js")
    ) {
      return src
    }
    let count = 0
    const out = src.replace(LAZY_REQUIRE, (line, kind, name, wrap, spec) => {
      if (
        Module.isBuiltin(spec) ||
        NEVER_LAZY.test(spec) ||
        // The proxy only stands in for property access: a module that's
        // called, constructed or passed around stays as it is
        !usedOnlyThroughMembers(name, src.replace(line, ""))
      ) {
        return line
      }
      count++
      const load = wrap
        ? `${wrap}require(${JSON.stringify(spec)}))`
        : `require(${JSON.stringify(spec)})`
      return `${kind} ${name} = __lazyReq(() => ${load});`
    })
    return count ? LAZY_HELPER + "\n" + out : src
  }

  /**
   * Keep each module's identity: its own __filename/__dirname (resolved for
   * where the bundle runs), the file it's evaluating as for stack-based
   * helpers, and explicit paths for defineFileConfig.
   */
  const keepIdentity = (file: string, src: string) => {
    if (/\b(const|let|var)\s+(__dirname|__filename)\b/.test(src)) {
      return src
    }
    // Requires esbuild can't follow (computed ones, require.resolve) resolve
    // from the file's own location, as they would unbundled. Not in files
    // that bring their own `require` (e.g. browserify-style bundles).
    const ownRequire = SHADOWED_REQUIRE.test(src)
    const header =
      `var __filename = globalThis.__medusaKeyToPath(${JSON.stringify(
        toKey(file)
      )});` +
      ` var __dirname = require("path").dirname(__filename);` +
      (ownRequire
        ? ""
        : ` var __medusaReq = globalThis.__medusaRequireFrom(__filename);`) +
      ` (globalThis.__MEDUSA_FILE_STACK__ ??= []).push(__filename);\n`
    const footer = `\n;globalThis.__MEDUSA_FILE_STACK__.pop();\n`
    if (!ownRequire) {
      src = src
        .replace(COMPUTED_REQUIRE, "__medusaReq(")
        .replace(REQUIRE_RESOLVE, "__medusaReq.resolve(")
    }
    const strict = src.match(/^\s*(["']use strict["'];?)/)
    let out = strict
      ? src.slice(0, strict[0].length) +
        "\n" +
        header +
        src.slice(strict[0].length)
      : header + src
    out = out.replace(
      /(defineFileConfig\)?\s*\(\s*\{)/g,
      "$1 path: __filename,"
    )
    if (file.endsWith(`${path.sep}get-caller-file-path.js`)) {
      const rewritten = out.replace(
        /function getCallerFilePath\(position = 2\) \{/,
        "$& const __stack = globalThis.__MEDUSA_FILE_STACK__; if (position === 2 && __stack && __stack.length) { return __stack[__stack.length - 1]; }"
      )
      // Without this rewrite, files that define workflows or file configs
      // would resolve their own path wrongly in the bundle: fail the build
      // rather than ship that
      if (rewritten === out && packageOf(file) === "@medusajs/utils") {
        throw new Error(
          `Unable to bundle the backend: "function getCallerFilePath(position = 2) {" was not found in ${file}. The bundler rewrites it to resolve callers from the bundle; update createTransforms in bundle-backend.ts to match the compiled output.`
        )
      }
      out = rewritten
    }
    return out + footer
  }

  const nativePackages = new Map<string, boolean>()
  const hasNativeAddon = (dir: string): boolean => {
    if (nativePackages.has(dir)) {
      return nativePackages.get(dir)!
    }
    let found = false
    try {
      // The package's own files only, not its nested dependencies
      found = readdirSync(dir, { recursive: true } as any).some(
        (f: any) =>
          String(f).endsWith(".node") && !String(f).includes("node_modules")
      )
    } catch {}
    nativePackages.set(dir, found)
    return found
  }
  // The builds (boot analysis, main file, each round of cold files) resolve
  // many of the same imports: each is resolved by esbuild once. What a build
  // then does with the result (inline, external) is still decided per build.
  const resolved = new Map<string, Promise<any>>()
  // Transformed sources, kept while the boot analysis and the main file read
  // the same files (see `forgetSources`)
  let sources: Map<string, Promise<string>> | null = new Map()
  const transformSource = async (file: string) => {
    if (isBuildOnlyCommand(file)) {
      return BUILD_ONLY_COMMAND_STUB
    }
    // A shebang means nothing inside a bundle
    let src = (await readFile(file, "utf8")).replace(/^#![^\n]*\n/, "\n")
    src = lazyBarrel(file, src) ?? src
    src = lazyRequires(file, src)
    return keepIdentity(file, src)
  }

  const vendorRoots = new Set<string>()

  return {
    vendorRoots,
    /**
     * Stops keeping transformed sources. Called once the main file is built:
     * cold files are each read by one build only, so keeping them would only
     * hold their text in memory.
     */
    forgetSources: () => {
      sources = null
    },
    /**
     * Resolves imports for a build. With a split policy, files the build
     * doesn't inline become by-key externals, resolved through the bundle's
     * registry at runtime (see the cold files in `bundleBackend`).
     */
    externals: (split?: {
      inline: (file: string) => boolean
      onExternal: (file: string) => void
    }) => ({
      name: "medusa-externals",
      setup(build: any) {
        build.onResolve({ filter: /.*/ }, async (args: any) => {
          if (args.pluginData?.skip || args.kind === "entry-point") {
            return
          }
          if (args.path.endsWith(".node")) {
            return { path: args.path, external: true }
          }
          const cacheKey = `${args.kind}\0${args.resolveDir}\0${args.path}`
          let resolving = resolved.get(cacheKey)
          if (!resolving) {
            resolving = build.resolve(args.path, {
              kind: args.kind,
              resolveDir: args.resolveDir,
              importer: args.importer,
              pluginData: { skip: true },
            }) as Promise<any>
            resolved.set(cacheKey, resolving)
          }
          const result = await resolving
          // Not installed at build time (optional dependencies, unused
          // drivers): leave the require as is
          if (result.errors.length) {
            return { path: args.path, external: true }
          }
          // Files that aren't code (e.g. a package requiring an .html file)
          // can't be compiled in: left as runtime requires, of the traced
          // files copied next to the bundle
          if (!/\.(c|m)?(js|ts)x?$|\.json$|\.node$/.test(result.path)) {
            return { path: args.path, external: true }
          }
          // Build tooling (Vite and friends) is only used by the admin's dev
          // server and build, never when serving: left out entirely
          if (BUILD_TOOLING.test(args.path)) {
            return { path: args.path, external: true }
          }
          // Packages shipping native addons can't be bundled: they're copied
          // next to the bundle and loaded from there, by package name
          const root = findPackageRoot(result.path)
          const packageName = root ? readPackageName(root) : undefined
          if (packageName && BUILD_TOOLING.test(packageName)) {
            return { path: args.path, external: true }
          }
          if (root && !isApp(result.path) && hasNativeAddon(root)) {
            const name = packageName
            if (name) {
              vendorRoots.add(root)
              return {
                path: `${EXTERNAL_PREFIX}nm:${name}/${path
                  .relative(root, result.path)
                  .split(path.sep)
                  .join("/")}`,
                external: true,
              }
            }
          }
          if (
            split &&
            /\.(c|m)?js$|\.json$/.test(result.path) &&
            !split.inline(result.path)
          ) {
            split.onExternal(result.path)
            return {
              path: `${EXTERNAL_PREFIX}${toKey(result.path)}`,
              external: true,
            }
          }
          return result
        })
      },
    }),
    sources: {
      name: "medusa-sources",
      setup(build: any) {
        build.onLoad({ filter: /\.(c|m)?js$/ }, async (args: any) => {
          if (args.path === entryFile) {
            return
          }
          let transforming = sources?.get(args.path)
          if (!transforming) {
            transforming = transformSource(args.path)
            sources?.set(args.path, transforming)
          }
          return {
            contents: await transforming,
            loader: "js",
            resolveDir: path.dirname(args.path),
          }
        })
      },
    },
  }
}

const packageRoots = new Map<string, string | null>()
function findPackageRoot(file: string): string | null {
  const dir = path.dirname(file)
  if (packageRoots.has(dir)) {
    return packageRoots.get(dir)!
  }
  const root = existsSync(path.join(dir, "package.json"))
    ? dir
    : path.dirname(dir) === dir
    ? null
    : findPackageRoot(dir)
  packageRoots.set(dir, root)
  return root
}

// Asked for every import the build resolves: read each package.json once
const packageNames = new Map<string, string | undefined>()
function readPackageName(root: string): string | undefined {
  if (packageNames.has(root)) {
    return packageNames.get(root)
  }
  let name: string | undefined
  try {
    name = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8")
    ).name
  } catch {}
  packageNames.set(root, name)
  return name
}

/**
 * A module's code directory: its package's `dist`, or the directory itself
 * for modules inside the app.
 */
function packageDistOf(moduleDir: string) {
  let dir = moduleDir
  while (
    path.dirname(dir) !== dir &&
    !existsSync(path.join(dir, "package.json"))
  ) {
    dir = path.dirname(dir)
  }
  const dist = path.join(dir, "dist")
  return existsSync(path.join(dir, "package.json")) && existsSync(dist)
    ? dist
    : moduleDir
}

/**
 * Copies packages into `<outDir>/node_modules`, with their dependencies.
 */
function vendorPackages(roots: Iterable<string>, outDir: string) {
  const target = path.join(outDir, "node_modules")
  const queue = [...roots]
  const copied = new Map<string, string>()
  while (queue.length) {
    const root = realpathSync(queue.pop()!)
    const name = readPackageName(root)
    if (!name || copied.has(name)) {
      continue
    }
    copied.set(name, root)
    mkdirSync(path.dirname(path.join(target, name)), { recursive: true })
    cpSync(root, path.join(target, name), {
      recursive: true,
      dereference: true,
      filter: (src) =>
        !src.slice(root.length).includes(`${path.sep}node_modules`),
    })
    const pkg = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8")
    )
    const req = createRequire(path.join(root, "package.json"))
    for (const dependency of Object.keys({
      ...pkg.dependencies,
      ...pkg.optionalDependencies,
    })) {
      try {
        queue.push(path.dirname(req.resolve(`${dependency}/package.json`)))
      } catch {
        try {
          const root = findPackageRoot(req.resolve(dependency))
          if (root) {
            queue.push(root)
          }
        } catch {}
      }
    }
  }
  return [...copied.keys()]
}

/**
 * Inlined first in the entry: with MEDUSA_LOG_BOOT_TIMINGS=true, records the
 * self time spent evaluating each bundled file. Every file pushes its path on
 * __MEDUSA_FILE_STACK__ when it starts and pops it when done (see
 * keepIdentity), so the time between two of those marks belongs to the file
 * on top. logBootSummary (@medusajs/utils) reports it.
 */
const RUNTIME_BOOT_PROFILE = `
if (process.env.MEDUSA_LOG_BOOT_TIMINGS === "true") {
  (function () {
    var stack = [], self = new Map(), last = performance.now();
    var charge = function () {
      var now = performance.now();
      if (stack.length) {
        var file = stack[stack.length - 1];
        self.set(file, (self.get(file) || 0) + now - last);
      }
      last = now;
    };
    stack.push = function (file) { charge(); return Array.prototype.push.call(this, file); };
    stack.pop = function () { charge(); return Array.prototype.pop.call(this); };
    globalThis.__MEDUSA_FILE_STACK__ = stack;
    globalThis.__MEDUSA_BOOT_EVAL_PROFILE__ = {
      startedAt: process.uptime(),
      self: self,
      coldLoads: { count: 0, ms: 0, depth: 0 },
    };
  })();
}
`

/**
 * Inlined in the bundle's entry: adds a hint to the "Cannot find module" error
 * of a request that is neither in the bundle nor on disk. The error's code and
 * first line stay as Node wrote them (code probes optional dependencies with
 * try/require), and errors already carrying the hint are left alone.
 */
export const RUNTIME_MISSING_MODULE_HINT = `
function __medusaAddMissingModuleHint(error, request) {
  if (!error || error.code !== "MODULE_NOT_FOUND" || typeof error.message !== "string") return;
  if (error.message.indexOf("medusa build --bundle") !== -1) return;
  if (require("module").isBuiltin(request)) return;
  var hint = "This app is running from a bundle built with 'medusa build --bundle'; '" + request + "' is not in the bundle and was not found on disk. Packages and modules that are only enabled at run time are not bundled: enable them in the configuration the build sees, or install them next to the bundle.";
  var message = error.message;
  error.message = message + "\\n" + hint;
  if (typeof error.stack === "string" && error.stack.indexOf(message) !== -1) {
    error.stack = error.stack.replace(message, error.message);
  }
}
`

/**
 * Inlined in the entry: an fs layer serving the directories and files the
 * build snapshotted (keyed like everything else), so boot never needs the
 * packages on disk. Anything not snapshotted falls through to the real fs.
 */
const RUNTIME_VIRTUAL_FS = `
function __medusaInstallVirtualFs(directories, files) {
  var fs = require("fs"), path = require("path"), url = require("url");
  var dirs = new Map(Object.entries(directories));
  var contents = new Map(Object.entries(files));
  var toPath = (p) => (p instanceof URL ? url.fileURLToPath(p) : typeof p === "string" ? path.resolve(p) : null);
  var kindOf = (p) => {
    var file = toPath(p);
    if (!file) return null;
    var key = __medusaPathToKey(file);
    if (dirs.has(key)) return "dir";
    if (contents.has(key)) return "file";
    // Walk up to the nearest snapshotted directory, then back down: a name
    // missing from a snapshotted listing doesn't exist (listings are complete)
    var missing = [];
    for (var dir = file; ; ) {
      var parent = path.dirname(dir);
      if (parent === dir) return null;
      missing.unshift(path.basename(dir));
      dir = parent;
      if (dirs.has(__medusaPathToKey(dir))) break;
    }
    for (var i = 0; i < missing.length; i++) {
      var entry = (dirs.get(__medusaPathToKey(dir)) || []).find((e) => e[0] === missing[i]);
      if (!entry) return "missing";
      if (i === missing.length - 1) return entry[1] ? "dir" : "file";
      if (!entry[1]) return "missing";
      dir = path.join(dir, missing[i]);
    }
    return null;
  };
  globalThis.__medusaVirtualKind = kindOf;
  globalThis.__medusaVirtualRead = (p) => {
    var file = toPath(p);
    return file ? contents.get(__medusaPathToKey(file)) : undefined;
  };
  var enoent = (op, p) => Object.assign(new Error("ENOENT: no such file or directory, " + op + " '" + p + "'"), { code: "ENOENT", errno: -2, syscall: op, path: String(p) });
  var stats = (kind) => {
    var time = new Date(0);
    return { isDirectory: () => kind === "dir", isFile: () => kind === "file", isSymbolicLink: () => false, isFIFO: () => false, isSocket: () => false, isBlockDevice: () => false, isCharacterDevice: () => false, size: 0, mode: kind === "dir" ? 16877 : 33188, mtime: time, ctime: time, atime: time, birthtime: time, mtimeMs: 0, ctimeMs: 0, atimeMs: 0, birthtimeMs: 0 };
  };
  var dirent = (name, isDir, parent) => ({ name, parentPath: parent, path: parent, isDirectory: () => isDir, isFile: () => !isDir, isSymbolicLink: () => false });
  var list = (p, options) => {
    var dir = toPath(p);
    var withTypes = options && typeof options === "object" && options.withFileTypes;
    var recursive = options && typeof options === "object" && options.recursive;
    var out = [];
    var walk = (current, prefix) => {
      for (var entry of dirs.get(__medusaPathToKey(current)) || []) {
        var name = prefix ? path.join(prefix, entry[0]) : entry[0];
        out.push(withTypes ? dirent(entry[0], entry[1], current) : name);
        if (recursive && entry[1]) walk(path.join(current, entry[0]), name);
      }
    };
    walk(dir, "");
    return out;
  };
  var read = (p, options) => {
    var data = contents.get(__medusaPathToKey(toPath(p)));
    var encoding = typeof options === "string" ? options : options && options.encoding;
    return encoding ? data : Buffer.from(data);
  };
  var syncVariant = (name, run) => {
    var original = fs[name];
    fs[name] = function (p, ...rest) {
      var kind = kindOf(p);
      return kind ? run(kind, p, rest, name) : original.call(this, p, ...rest);
    };
  };
  var answer = (kind, p, rest, op) => {
    switch (op.replace(/Sync$/, "")) {
      case "existsSync": case "exists": return kind !== "missing";
      case "readdir": if (kind !== "dir") throw enoent("scandir", p); return list(p, rest[0]);
      case "stat": case "lstat": if (kind === "missing") throw enoent(op, p); return stats(kind);
      case "access": if (kind === "missing") throw enoent("access", p); return undefined;
      case "realpath": if (kind === "missing") throw enoent("realpath", p); return toPath(p);
      case "readFile": if (kind !== "file" || !contents.has(__medusaPathToKey(toPath(p)))) throw enoent("open", p); return read(p, rest[0]);
    }
  };
  for (var name of ["readdirSync", "statSync", "lstatSync", "accessSync", "realpathSync", "readFileSync"]) syncVariant(name, answer);
  var existsSync = fs.existsSync;
  fs.existsSync = (p) => { var kind = kindOf(p); return kind ? kind !== "missing" : existsSync(p); };
  fs.realpathSync.native = fs.realpathSync;
  for (var name of ["readdir", "stat", "lstat", "access", "realpath", "readFile"]) {
    (function (name) {
      var original = fs[name];
      fs[name] = function (p, ...rest) {
        var kind = kindOf(p);
        if (!kind) return original.call(this, p, ...rest);
        var cb = rest.pop();
        try { var result = answer(kind, p, rest, name); process.nextTick(() => cb(null, result)); } catch (e) { process.nextTick(() => cb(e)); }
      };
      var promised = fs.promises[name];
      fs.promises[name] = function (p, ...rest) {
        var kind = kindOf(p);
        if (!kind) return promised.call(this, p, ...rest);
        try { return Promise.resolve(answer(kind, p, rest, name)); } catch (e) { return Promise.reject(e); }
      };
    })(name);
  }
  // fs-extra and others expect the native variant of the callback form too
  fs.realpath.native = fs.realpath;
}
`

/**
 * The node_modules directory packages are really installed in: where
 * @medusajs/medusa resolves to (the repository root's in hoisted or pnpm
 * monorepos), falling back to the project's.
 */
function findNodeModulesRoot(directory: string) {
  const fallback = path.join(directory, "node_modules")
  try {
    const medusa = realpathSync(
      createRequire(path.join(directory, "package.json")).resolve(
        "@medusajs/medusa"
      )
    )
    const marker = `${path.sep}node_modules${path.sep}`
    const at = medusa.indexOf(marker)
    return at === -1 ? fallback : medusa.slice(0, at + marker.length - 1)
  } catch {
    return fallback
  }
}

/**
 * The bundle's entry point: enables Node's compile cache before the bundle
 * is loaded (so it applies to it), parses the command, and loads the bundle.
 * Commands: `start` (default) and the `db:migrate` commands, with their CLI
 * flags. `db:migrate` runs the other two in child processes, through this
 * launcher (see `__MEDUSA_BUNDLE_LAUNCHER__`).
 */
export const LAUNCHER = `${BUNDLE_MARKER}
"use strict";
var Module = require("module");
var path = require("path");

// The cache is written by the first run on the machine the bundle runs on.
// It can't be prepared at build time: it is tied to the bundle's path, and
// V8 only caches the functions a run actually compiled, which the build can't
// exercise without a database. Hosts that start each process in a fresh
// container gain nothing from it, so they can disable it.
if (Module.enableCompileCache && !process.env.MEDUSA_DISABLE_COMPILE_CACHE) {
  try {
    Module.enableCompileCache(process.env.MEDUSA_COMPILE_CACHE_DIR || path.join(__dirname, "${COMPILE_CACHE_DIR}"));
  } catch (e) {}
}

var FLAGS = {
  start: { "-p": "port", "--port": "port", "-H": "host", "--host": "host", "--cluster": "cluster", "--workers": "workers", "--servers": "servers" },
  "db:migrate": { "--skip-scripts": "skipScripts", "--skip-links": "skipLinks", "--skip-search": "skipSearch", "--execute-all-links": "executeAllLinks", "--execute-safe-links": "executeSafeLinks", "--execute-all-search": "executeAllSearch", "--execute-safe-search": "executeSafeSearch", "--concurrency": "concurrency", "--all-or-nothing": "allOrNothing" },
  "db:migrate:scripts": {},
  "db:migrate:search": { "--execute-all-search": "executeAllSearch", "--execute-safe-search": "executeSafeSearch" },
};
var VALUES = { port: 1, host: 1, cluster: 1, workers: 1, servers: 1, concurrency: 1 };

var argv = process.argv.slice(2);
var name = argv[0] && !argv[0].startsWith("-") ? argv.shift() : "start";
if (!FLAGS[name]) {
  console.error("Unknown command '" + name + "'. The bundle supports: " + Object.keys(FLAGS).join(", "));
  process.exit(1);
}
var args = {};
for (var i = 0; i < argv.length; i++) {
  var parts = argv[i].split("=");
  var key = FLAGS[name][parts[0]];
  if (!key) {
    console.error("Unknown option '" + parts[0] + "' for " + name);
    process.exit(1);
  }
  if (VALUES[key]) {
    var value = parts.length > 1 ? parts.slice(1).join("=") : argv[i + 1] && !argv[i + 1].startsWith("-") ? argv[++i] : undefined;
    args[key] = key === "concurrency" && value !== undefined ? Number(value) : value;
  } else {
    args[key] = parts.length > 1 ? parts[1] !== "false" : true;
  }
}

globalThis.__MEDUSA_BUNDLE_COMMAND__ = { name: name, args: args };
globalThis.__MEDUSA_BUNDLE_LAUNCHER__ = __filename;
require("./${MAIN_FILE_NAME}");
`

/**
 * What bundled code can still load from disk that the bundle doesn't contain:
 * native binaries, files read with fs, targets of requires esbuild can't
 * follow. Traced with @vercel/nft (as Next.js's standalone output is) and
 * copied next to the bundle in the same node_modules layout, symlinks
 * included, so lookups resolve as they would unbundled (see the requires
 * rewritten in `keepIdentity`).
 */
async function copyTracedFiles({
  entries,
  leftOut,
  bundled,
  addressable,
  outDir,
  nodeModulesRoot,
  directory,
}: {
  entries: string[]
  /** Files the build deliberately keeps out of the bundle */
  leftOut: (file: string) => boolean
  /** Files compiled into the bundle */
  bundled: Set<string>
  /** Bundled files the bundle can load by path at runtime */
  addressable: Set<string>
  outDir: string
  nodeModulesRoot: string
  directory: string
}): Promise<{ files: number; bytes: number }> {
  const { nodeFileTrace } = require("@vercel/nft")
  // Only the project, its packages and linked ones: paths built at runtime
  // (e.g. from os.homedir()) would otherwise pull in unrelated folders
  const roots = new Set([nodeModulesRoot, outDir, directory])
  for (const entry of entries) {
    if (!entry.startsWith(nodeModulesRoot + path.sep)) {
      const root = findPackageRoot(entry)
      if (root) {
        roots.add(root)
      }
    }
  }
  const withinRoots = (file: string) =>
    [...roots].some((root) => file === root || file.startsWith(root + path.sep))
  const { fileList, reasons } = await nodeFileTrace(entries, {
    base: "/",
    processCwd: directory,
    mixedModules: true,
    ignore: (relative: string) => {
      const file = path.join("/", relative)
      return !withinRoots(file) || isBuildToolingPath(file) || leftOut(file)
    },
  })

  // Compiled in, but loadable only if nothing reaches it other than through
  // requires esbuild followed too
  const reachedDynamically = (file: string) =>
    (reasons.get(file)?.type ?? []).some(
      (type: string) => !STATIC_TRACE_REASONS.has(type)
    )

  const candidates: { file: string; stat: Stats }[] = []
  // Packages with something to copy besides their manifest and links: only
  // those get a package.json and links. A package that's fully bundled must
  // leave nothing behind, or lookups would find a package without its code
  // (instead of resolving it from the bundle).
  const withContent = new Set<string>()
  for (const relative of fileList as Set<string>) {
    const file = path.join("/", relative)
    if (
      !file.startsWith(nodeModulesRoot + path.sep) ||
      file.startsWith(outDir + path.sep) ||
      /\.(d\.ts|map)$/.test(file) ||
      addressable.has(file) ||
      (bundled.has(file) && !reachedDynamically(relative))
    ) {
      continue
    }
    const stat = lstatSync(file, { throwIfNoEntry: false })
    if (!stat) {
      continue
    }
    candidates.push({ file, stat })
    if (stat.isFile() && path.basename(file) !== "package.json") {
      const root = nearestPackageDir(file)
      if (root) {
        withContent.add(root)
      }
    }
  }

  const target = path.join(outDir, "node_modules")
  let files = 0
  let bytes = 0
  for (const { file, stat } of candidates) {
    if (stat.isSymbolicLink()) {
      const linked = realpathSync(file)
      if (!withContent.has(nearestPackageDir(path.join(linked, "x")) ?? "")) {
        continue
      }
    } else if (
      path.basename(file) === "package.json" &&
      !withContent.has(path.dirname(file))
    ) {
      continue
    }
    const destination = path.join(target, path.relative(nodeModulesRoot, file))
    if (existsSync(destination)) {
      continue
    }
    mkdirSync(path.dirname(destination), { recursive: true })
    if (stat.isSymbolicLink()) {
      // pnpm's links are relative, and stay valid inside the copied tree
      symlinkSync(readlinkSync(file), destination)
    } else if (stat.isFile()) {
      copyFileSync(file, destination)
      files++
      bytes += stat.size
    }
  }
  return { files, bytes }
}

// The closest directory with a package.json, as a path (not resolved)
function nearestPackageDir(file: string): string | undefined {
  for (let dir = path.dirname(file); path.dirname(dir) !== dir; ) {
    if (existsSync(path.join(dir, "package.json"))) {
      return dir
    }
    dir = path.dirname(dir)
  }
  return undefined
}

// Reasons @vercel/nft records for a file reached by a plain require/import
const STATIC_TRACE_REASONS = new Set(["initial", "resolve", "dependency"])

function isBuildToolingPath(file: string): boolean {
  const match = file.match(/.*node_modules[\\/]((?:@[^\\/]+[\\/])?[^\\/]+)/)
  return !!match && BUILD_TOOLING.test(match[1].split(path.sep).join("/"))
}

/**
 * Whether every use of a binding is a property access (`x.y`, `x?.y`,
 * `x[y]`), so a lazy proxy for it behaves exactly like the value. Matches in
 * strings or comments only make this stricter.
 */
export function usedOnlyThroughMembers(name: string, src: string): boolean {
  const escaped = name.replace(/\$/g, "\\$")
  for (const match of src.matchAll(
    new RegExp(`(?<![\\w$.])${escaped}(?![\\w$])`, "g")
  )) {
    const after = src.slice(match.index! + name.length).trimStart()
    if (!/^(\?\.(?!\()|\.|\[)/.test(after)) {
      return false
    }
  }
  return true
}

/**
 * Adds a resolution for each specifier the bundled @medusajs packages export
 * (`exports` subpaths, wildcards expanded against the bundled files) that
 * isn't resolved yet.
 */
export function addPackageExportResolutions(
  bundledFiles: Set<string>,
  resolutions: Record<string, string>
) {
  const roots = new Set<string>()
  for (const file of bundledFiles) {
    const root = findPackageRoot(file)
    if (root && readPackageName(root)?.startsWith("@medusajs/")) {
      roots.add(root)
    }
  }
  for (const root of roots) {
    const pkg = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8")
    )
    const exportsMap =
      typeof pkg.exports === "string" ? { ".": pkg.exports } : pkg.exports ?? {}
    const filesInRoot = [...bundledFiles].filter((file) =>
      file.startsWith(root + path.sep)
    )
    for (const [subpath, value] of Object.entries<any>(exportsMap)) {
      const target =
        typeof value === "string"
          ? value
          : value?.require ?? value?.node ?? value?.default
      if (typeof target !== "string" || !subpath.startsWith(".")) {
        continue
      }
      const request = pkg.name + subpath.slice(1)
      if (!subpath.includes("*")) {
        const file = path.resolve(root, target)
        if (bundledFiles.has(file)) {
          resolutions[request] ??= file
        }
        continue
      }
      // Patterns map one wildcard onto one wildcard; anything else (e.g. a
      // pattern pointing at a single file) isn't expanded
      const targetParts = path.resolve(root, target).split("*")
      const requestParts = request.split("*")
      if (targetParts.length !== 2 || requestParts.length !== 2) {
        continue
      }
      const [targetPrefix, targetSuffix] = targetParts
      const [requestPrefix, requestSuffix] = requestParts
      for (const file of filesInRoot) {
        if (
          file.length > targetPrefix.length + targetSuffix.length &&
          file.startsWith(targetPrefix) &&
          file.endsWith(targetSuffix)
        ) {
          const match = file
            .slice(targetPrefix.length, file.length - targetSuffix.length)
            .split(path.sep)
            .join("/")
          resolutions[requestPrefix + match + requestSuffix] ??= file
        }
      }
    }
  }
}

function isRequirableJson(file: string): boolean {
  try {
    JSON.parse(readFileSync(file, "utf8"))
    return true
  } catch {
    return false
  }
}
