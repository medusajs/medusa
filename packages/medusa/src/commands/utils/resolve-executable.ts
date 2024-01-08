import path from "path"

export function resolveExecutable(startDir, moduleName, ...pathToExecutable) {
  try {
    // Resolve path of module e.g. @medusajs/medusa
    const resolvedPath = require.resolve(moduleName, { paths: [startDir] })
    // Resolve path of binary in module e.g. @medusajs/medusa/dist/bin/medusa.js
    const pathToBinary = path.resolve(resolvedPath, ...pathToExecutable)
    return pathToBinary
  } catch (e) {
    // If not found in the current directory, move to the parent directory
    const parentDir = path.resolve(startDir, "..")
    if (parentDir === startDir) {
      // If the parent directory is the same as the current, we've reached the root
      return null
    }
    return resolveExecutable(parentDir, moduleName, ...pathToExecutable)
  }
}
