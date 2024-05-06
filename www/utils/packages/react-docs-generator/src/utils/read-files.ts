import { statSync, readFileSync } from "fs"
import { globSync } from "glob"

export default function readFiles(path: string): Map<string, string> {
  const files = new Map<string, string>()
  // check if path is for a file
  const fileStats = statSync(path)
  if (fileStats.isFile()) {
    files.set(path, readFileSync(path, "utf-8"))
  } else {
    const filePaths = globSync(`${path}/**/*.{tsx,jsx}`, {
      ignore: [`${path}/**/*.spec.*`, `${path}/**/*.stories.*`],
    })
    filePaths.forEach((filePath) => {
      files.set(filePath, readFileSync(filePath, "utf-8"))
    })
  }

  return files
}
