import Module from "module"
import path from "path"

const fallback = (filename: string) => {
  const mod = new Module(filename)

  mod.filename = filename
  mod.paths = (Module as any)._nodeModulePaths(path.dirname(filename))
  ;(mod as any)._compile(`module.exports = require;`, filename)

  return mod.exports
}

// Polyfill Node's `Module.createRequireFromPath` if not present (added in Node v10.12.0)
const createRequireFromPath = Module.createRequire || fallback

export default createRequireFromPath
