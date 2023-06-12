import fse from "fs-extra"

/**
 * Filter function to exclude test files and folders, as well as webpack configurations from being copied to the cache folder.
 */
export function copyFilter(src: string) {
  if (fse.lstatSync(src).isDirectory() && src.includes("__test__")) {
    return false
  }

  if (fse.lstatSync(src).isFile()) {
    if (
      src.includes(".test") ||
      src.includes(".spec") ||
      src.includes("webpack.config")
    ) {
      return false
    }
  }

  return true
}
