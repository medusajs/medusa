import Module from "module"
import path from "path"

const fallback = filename => {
  const mod = new Module(filename)

  mod.filename = filename
  mod.paths = Module._nodeModulePaths(path.dirname(filename))
  mod._compile(`module.exports = require;`, filename)

  return mod.exports
}

// Polyfill Node's `Module.createRequireFromPath` if not present (added in Node v10.12.0)
const createRequireFromPath =
  Module.createRequire || Module.createRequireFromPath || fallback

export default createRequireFromPath
