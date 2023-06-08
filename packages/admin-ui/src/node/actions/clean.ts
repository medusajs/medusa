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
  const cacheDir = path.join(appDir, ".cache")
  const buildDir = path.join(outDir, "build")

  await fse.remove(buildDir)
  await fse.remove(cacheDir)
}
