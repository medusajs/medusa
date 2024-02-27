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
    const files = glob.sync(`${workflowPath}/**/*.{ts,js}`, {})
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

  fileInfo.code = readFileSync(filePath, "utf-8")

  if (imported.default) {
    switch (typeof imported.default) {
      case "function":
        fileInfo.workflowId = getWorkflowName(imported.default) || ""
        break
      case "object":
        Object.values(imported.default).find((exportedVariable: unknown) => {
          fileInfo.workflowId = getWorkflowName(exportedVariable) || ""
          return fileInfo.workflowId.length !== 0
        })
    }
  } else if (typeof imported === "object") {
    Object.values(imported).find((exportedVariable: unknown) => {
      fileInfo.workflowId = getWorkflowName(exportedVariable) || ""
      return fileInfo.workflowId.length !== 0
    })
  }

  return fileInfo
}

function getWorkflowName(variable: unknown): string | undefined {
  return typeof variable === "function" &&
    "getName" in variable &&
    typeof variable.getName === "function"
    ? variable.getName()
    : undefined
}
