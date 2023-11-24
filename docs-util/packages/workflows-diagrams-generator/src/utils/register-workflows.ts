import { statSync, readFileSync } from "fs"
import * as glob from "glob"
import path from "path"
import { fileURLToPath } from "url"

type FileInfo = {
  workflowId: string
  code: string
}

export default async function (
  workflowPath: string
): Promise<Map<string, string>> {
  const workflowDefinitions = new Map<string, string>()
  const fileStat = statSync(workflowPath)
  if (fileStat.isFile()) {
    const fileInfo = await importFile(workflowPath)
    if (fileInfo.workflowId.length && fileInfo.code.length) {
      workflowDefinitions.set(fileInfo.workflowId, fileInfo.code)
    }
  } else {
    const files = glob.sync(`${workflowPath}/*.{ts,js}`, {})
    await Promise.all(
      files.map(async (file) => {
        const fileInfo = await importFile(file)
        if (fileInfo.workflowId.length && fileInfo.code.length) {
          workflowDefinitions.set(fileInfo.workflowId, fileInfo.code)
        }
      })
    )
  }

  return workflowDefinitions
}

function getRelativeImportPath(filePath: string) {
  const __filename = fileURLToPath(import.meta.url)
  return path.relative(path.dirname(__filename), filePath)
}

async function importFile(filePath: string): Promise<FileInfo> {
  const fileInfo: FileInfo = {
    workflowId: "",
    code: "",
  }

  const relativeFilePath = getRelativeImportPath(filePath)
  const imported = await import(relativeFilePath)

  // fileInfo.code = readFileSync(relativeFilePath, "utf-8")

  // if (imported.default) {
  //   fileInfo.workflowId = imported.default.getId()
  // } else if (typeof imported === "object") {
  //   const exportedVariables = Object.values(imported)
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   exportedVariables.find((variable: any) => {
  //     if ("getId" in variable && typeof variable.getId === "function") {
  //       fileInfo.workflowId = variable.getId()
  //       return true
  //     }
  //     return false
  //   })
  // }

  return fileInfo
}
