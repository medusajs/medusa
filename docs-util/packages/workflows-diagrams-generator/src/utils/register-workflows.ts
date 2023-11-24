import { stat } from "fs/promises"
import * as glob from "glob"
import path from "path"
import { fileURLToPath } from "url"

export default async function (workflowPath: string): Promise<void> {
  const fileStat = await stat(workflowPath)
  if (fileStat.isFile()) {
    console.log(getRelativeImportPath(workflowPath))
    await import(getRelativeImportPath(workflowPath))
  } else {
    const files = glob.sync(`${workflowPath}/*.{ts,js}`, {})
    await Promise.all(
      files.map(async (file) => import(getRelativeImportPath(file)))
    )
  }
}

function getRelativeImportPath(filePath: string) {
  const __filename = fileURLToPath(import.meta.url)
  return path.relative(path.dirname(__filename), filePath)
}
