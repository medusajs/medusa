import path from "path"

export function resolveExecutable(startDir, executable) {
  console.log("Start directory: ", startDir)
  try {
    // Try to resolve the path of @babel/cli starting from the given directory
    console.log("")
    const resolvedPath = require.resolve(executable, { paths: [startDir] })
    return path.resolve(resolvedPath, "..", "bin", "babel.js")
  } catch (e) {
    // If not found in the current directory, move to the parent directory
    const parentDir = path.resolve(startDir, "..")
    console.log("Parent directory: ", parentDir)
    if (parentDir === startDir) {
      // If the parent directory is the same as the current, we've reached the root
      return null
    }
    return resolveExecutable(parentDir, executable)
  }
}
