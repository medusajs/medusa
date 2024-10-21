import { existsSync } from "fs"
import { readdir } from "fs/promises"
import path from "path"

const projectBasePath = path.resolve()

const getProjectFilesForDir = async (dir: string): Promise<string[]> => {
  const allFiles: string[] = []
  const filesInDir = await readdir(dir, {
    withFileTypes: true,
    recursive: true,
  })

  filesInDir.forEach((file) => {
    if (file.isDirectory() || path.basename(file.name) !== "page.mdx") {
      return
    }

    const fullFilePath = path.join(file.path, file.name)

    // TODO check if this produces correct file paths
    allFiles.push(path.relative(projectBasePath, fullFilePath))
  })

  return allFiles
}

type Options = {
  includeReferences?: boolean
}

export const getAllProjectFiles = async ({
  includeReferences = false,
}: Options): Promise<string[]> => {
  const appDir = path.join(projectBasePath, "app")

  const files = await getProjectFilesForDir(appDir)

  if (includeReferences) {
    const referencesDir = path.join(projectBasePath, "references")
    if (existsSync(referencesDir)) {
      files.push(...(await getProjectFilesForDir(referencesDir)))
    }
  }

  return files
}
