import path from "path"

export default function getRelativePaths(
  filePaths: string[],
  pathPrefix: string
): string[] {
  return filePaths.map((filePath) => path.resolve(pathPrefix, filePath))
}
