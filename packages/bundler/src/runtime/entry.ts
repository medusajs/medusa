import { createRequire } from "module"
import { BUNDLE_FILE_NAME, EXTERNAL_PREFIX } from "../constants"
import { resolveFrom } from "../packages"
import { RUNTIME_PATH_KEYS } from "../paths"
import { RUNTIME_BOOT_PROFILE } from "./boot-profile"
import { RUNTIME_MISSING_MODULE_HINT } from "./missing-module-hint"
import { RUNTIME_VIRTUAL_FS } from "./virtual-fs"

/**
 * The bundle's entry: resolves the manifest's keys for where the bundle
 * runs, routes requires of bundled files to the bundled modules (files
 * loaded by path at runtime, like routes, are looked up by key), and starts
 * the server.
 */
export function createEntry({
  manifest,
  registry,
  startFile,
  migrateFiles,
  globalSetupFiles,
  directories,
  files,
  resolutions,
  unbundled,
  medusaDist,
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
  /** `@medusajs/medusa`'s dist folder, which the framework is resolved from */
  medusaDist: string
}) {
  // dotenv as Medusa resolves it (the app itself may not depend on it)
  const dotenvFile = createRequire(
    resolveFrom(medusaDist, "@medusajs/framework")
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
    // Entries left external are plain requires: don't loop back here.
    if (hit && !__loading.has(hit)) {
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
