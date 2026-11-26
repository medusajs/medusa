import path from "path"

/**
 * The bundle and its build manifest refer to files by relocatable keys, since
 * the build output is usually copied elsewhere and installed there:
 *
 * - `app:<path>` for files of the built application, relative to its root
 *   (the directory the bundle is written to)
 * - `nm:<path>` for installed packages, relative to `node_modules`
 * - an absolute path for anything else (e.g. packages linked from elsewhere)
 */
export function createPathKeys({
  appRoot,
  nodeModulesRoot,
}: {
  appRoot: string
  nodeModulesRoot: string
}) {
  const appPrefix = appRoot + path.sep
  const nodeModulesPrefix = nodeModulesRoot + path.sep

  return (file: string): string => {
    if (file.startsWith(nodeModulesPrefix)) {
      return "nm:" + file.slice(nodeModulesPrefix.length)
    }
    if (file.startsWith(appPrefix)) {
      return "app:" + file.slice(appPrefix.length)
    }
    return file
  }
}

/**
 * The runtime counterpart, inlined in the bundle's entry: resolves keys to
 * paths in the deployed location (the bundle's directory and its
 * node_modules), and paths back to keys.
 */
export const RUNTIME_PATH_KEYS = `
var __medusaAppRoot = __dirname;
// The nearest node_modules, as Node resolves: installed next to the build
// output when deployed, or in a parent directory (e.g. the project's)
var __medusaNodeModules = (function () {
  var path = require("path"), fs = require("fs");
  for (var dir = __medusaAppRoot; ; dir = path.dirname(dir)) {
    var candidate = path.join(dir, "node_modules");
    if (fs.existsSync(candidate)) return candidate;
    if (path.dirname(dir) === dir) return path.join(__medusaAppRoot, "node_modules");
  }
})();
function __medusaKeyToPath(key) {
  if (key.startsWith("app:")) return require("path").join(__medusaAppRoot, key.slice(4));
  if (key.startsWith("nm:")) return require("path").join(__medusaNodeModules, key.slice(3));
  return key;
}
function __medusaPathToKey(file) {
  var sep = require("path").sep;
  if (file.startsWith(__medusaNodeModules + sep)) return "nm:" + file.slice(__medusaNodeModules.length + 1);
  if (file.startsWith(__medusaAppRoot + sep)) return "app:" + file.slice(__medusaAppRoot.length + 1);
  return file;
}
globalThis.__medusaKeyToPath = __medusaKeyToPath;
`
