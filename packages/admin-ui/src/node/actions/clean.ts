import fse from "fs-extra"
import path from "node:path"

type CleanArgs = {
  appDir: string
  outDir: string
}

/**
 * Cleans the build directory and cache directory.
 */
export async function clean({ appDir, outDir }: CleanArgs) {
  const cacheDir = path.resolve(appDir, ".cache", "admin")
  const buildDir = path.resolve(appDir, outDir)

  console.log("Cleaning build directory", buildDir)
  console.log("Cleaning build directory", buildDir)
  console.log("Cleaning build directory", buildDir)

  console.log("Cleaning cache directory", cacheDir)
  console.log("Cleaning cache directory", cacheDir)
  console.log("Cleaning cache directory", cacheDir)

  await fse.remove(buildDir)
  await fse.remove(cacheDir)
}
