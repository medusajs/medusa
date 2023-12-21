import path from "path"

export function resolveBabelCLI(directory: string) {
  try {
    const pathToBabel = require.resolve("@babel/cli", { paths: [directory] })
    const babelExecutable = path.resolve(pathToBabel, "..", "bin", "babel.js")
    return babelExecutable
  } catch (e) {
    // If not found in the current directory, move to the parent directory
    const parentDir = path.resolve(directory, "..")
    if (parentDir === directory) {
      // If the parent directory is the same as the current, we've reached the root
      return null
    }

    return resolveBabelCLI(parentDir)
  }
}
