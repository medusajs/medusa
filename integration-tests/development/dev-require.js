if (process.env.NODE_ENV !== "development") {
  return
}

const path = require("path")

const Module = require("module")
const originalRequire = Module.prototype.require
const medusaCore = path.resolve(path.join(__dirname, "../../packages"))

function replacePath(requirePath, package, concatPackage = true) {
  const idx = requirePath.indexOf(package)
  const packPath = requirePath.substring(idx + package.length)

  let newPath =
    medusaCore +
    "/" +
    (concatPackage ? package + "/" : "") +
    packPath.replace("/dist", "/src").replace(".js", "")

  if (!newPath.includes("/src")) {
    newPath += "/src"
  }
  return path.resolve(newPath)
}

Module.prototype.require = function (...args) {
  const interfaces = "medusa-interfaces"
  const utils = "medusa-core-utils"
  const base = "@medusajs"

  if (args[0].includes(base)) {
    args[0] = replacePath(args[0], base, false)
  } else if (args[0].includes(interfaces)) {
    args[0] = replacePath(args[0], interfaces)
  } else if (args[0].includes(utils)) {
    args[0] = replacePath(args[0], utils)
  }

  if (args[0] === "glob") {
    const glob = originalRequire.apply(this, args)
    const originalGlobSync = glob.sync
    glob.GlobSync = glob.sync = (pattern, options) => {
      if (pattern.endsWith(".js") || pattern.endsWith(".ts")) {
        pattern = pattern.replace(".js", ".{j,t}s").replace("/dist/", "/src/")
      }

      return originalGlobSync.apply(this, [pattern, options])
    }
    return glob
  }

  return originalRequire.apply(this, args)
}
