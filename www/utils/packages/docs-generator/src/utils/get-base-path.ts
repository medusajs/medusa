/**
 * Retrieve the pathname of a file without the relative part before `packages/`
 *
 * @param fileName - The file name/path
 * @returns The path without the relative part.
 */
export default function getBasePath(fileName: string) {
  let basePath = fileName
  const packageIndex = fileName.indexOf("packages/")
  if (packageIndex) {
    basePath = basePath.substring(packageIndex)
  }

  return basePath
}
