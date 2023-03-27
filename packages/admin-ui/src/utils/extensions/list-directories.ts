import fse from "fs-extra"
import path from "path"

export async function listDirectories(location: string): Promise<string[]> {
  const fullPath = path.resolve(location)
  const files = await fse.readdir(fullPath)

  const directories: string[] = []

  for (const file of files) {
    const filePath = path.resolve(fullPath, file)
    const stats = await fse.stat(filePath)

    if (stats.isDirectory()) {
      directories.push(filePath)
    }
  }

  return directories
}
