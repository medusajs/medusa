import { existsSync, readFileSync } from "fs"
import { EOL } from "os"
import { dirname, join, parse } from "path"

export function loadPackageJson(
  startPath: string = process.cwd()
): Record<string, any> {
  const rootPath = parse(startPath).root
  if (startPath === rootPath) {
    throw new Error(
      `Could not find a "package.json" file.${EOL}This is likely not a Node.js project.`
    )
  }

  const packagePath = join(startPath, "package.json")

  if (existsSync(packagePath)) {
    const packagePath = join(startPath, "package.json")
    return JSON.parse(readFileSync(packagePath, "utf-8"))
  }

  return loadPackageJson(dirname(startPath))
}
