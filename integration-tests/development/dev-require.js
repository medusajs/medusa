if (process.env.NODE_ENV !== `development`) {
  return
}

const path = require("path")

const Module = require("module")
const originalRequire = Module.prototype.require
const medusaCore = path.resolve(path.join(__dirname, "../../packages"))
const currentPath = path.resolve(__dirname, "..")

Module.prototype.require = function (...args) {
  const base = "@medusajs/"

  if (args[0].indexOf(base) > -1) {
    const idx = args[0].indexOf(base)

    const packPath = args[0].substring(idx + base.length)
    args[0] =
      medusaCore + "/" + packPath.replace("/dist/", "/src/").replace(".js", "")
  }

  if (args[0] === "glob") {
    const glob = originalRequire.apply(this, args)
    const originalGlobSync = glob.sync
    glob.GlobSync = glob.sync = (pattern, options) => {
      if (pattern.endsWith(".js") || pattern.endsWith(".ts")) {
        pattern = pattern
          .replace(currentPath, medusaCore)
          .replace(".js", ".{j,t}s")
          .replace("/dist/", "/src/")
      }
      return originalGlobSync.apply(this, [pattern, options])
    }
    return glob
  }

  return originalRequire.apply(this, args)
}
