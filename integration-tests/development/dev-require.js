if (process.env.NODE_ENV !== "development") {
  return
}
const path = require("path")

const Module = require("module")
const originalRequire = Module.prototype.require
const medusaCore = path.resolve(path.join(__dirname, "../../packages"))

function replacePath(requirePath, pack, concatPackage = true) {
  const idx = requirePath.indexOf(pack)
  const packPath = requirePath.substring(idx + pack.length).replace(/\\/g, "/")

  let newPath =
    medusaCore +
    "/" +
    (concatPackage ? pack + "/" : "") +
    packPath.replace("/dist", "/src").replace(".js", "")

  if (!newPath.includes("/src")) {
    newPath += "/src"
  }

  return path.resolve(newPath)
}

function checkAndReplacePaths(path) {
  const interfaces = "medusa-interfaces"
  const utils = "medusa-core-utils"
  const base = "@medusajs"

  if (path.includes(base)) {
    path = replacePath(path, base, false)
  } else if (path.includes(interfaces)) {
    path = replacePath(path, interfaces)
  } else if (path.includes(utils)) {
    path = replacePath(path, utils)
  }

  return path
}

Module.prototype.require = function (...args) {
  args[0] = checkAndReplacePaths(args[0])

  if (args[0] === "glob") {
    const glob = originalRequire.apply(this, args)
    const originalGlobSync = glob.sync
    glob.GlobSync = glob.sync = (pattern, options) => {
      if (pattern.endsWith(".js") || pattern.endsWith(".ts")) {
        pattern = checkAndReplacePaths(pattern)
        pattern = pattern.replace(".js", ".{j,t}s").replace("/dist/", "/src/")
      }

      return originalGlobSync.apply(this, [pattern, options])
    }
    return glob
  } else if (args[0] === "resolve-cwd") {
    const resolveCwd = originalRequire.apply(this, args)
    const newResolveCwd = (pattern) => {
      pattern = checkAndReplacePaths(pattern)

      return resolveCwd.apply(this, [pattern])
    }
    return newResolveCwd
  }

  return originalRequire.apply(this, args)
}
