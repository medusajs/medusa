import { getWorkflowDefinition, isWorkflow } from "@medusajs/workflows-sdk"
import { statSync, readFileSync } from "fs"
import * as glob from "glob"
import path from "path"
import { fileURLToPath } from "url"

export type WorkflowDefinition = ReturnType<typeof getWorkflowDefinition>

type FileInfo = {
  workflowId: string
  code: string
  definition?: WorkflowDefinition
}

export type RegisteredWorkflow = {
  code: string
  definition: WorkflowDefinition
}

export default async function (
  workflowPath: string
): Promise<Map<string, RegisteredWorkflow>> {
  const workflowDefinitions = new Map<string, RegisteredWorkflow>()
  const fileStat = statSync(workflowPath)
  if (fileStat.isFile()) {
    const fileInfo = await importFile(workflowPath)
    if (fileInfo.definition && fileInfo.code.length) {
      workflowDefinitions.set(fileInfo.workflowId, {
        code: fileInfo.code,
        definition: fileInfo.definition,
      })
    }
  } else {
    const files = glob.sync(`${workflowPath}/**/*.{ts,js}`, {})
    await Promise.all(
      files.map(async (file) => {
        const fileInfo = await importFile(file)
        if (fileInfo.definition && fileInfo.code.length) {
          workflowDefinitions.set(fileInfo.workflowId, {
            code: fileInfo.code,
            definition: fileInfo.definition,
          })
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

  const candidates: unknown[] = []
  if (imported.default) {
    candidates.push(imported.default)
    if (typeof imported.default === "object") {
      candidates.push(...Object.values(imported.default))
    }
  } else if (typeof imported === "object") {
    candidates.push(...Object.values(imported))
  }

  const workflow = candidates.find((candidate) => isWorkflow(candidate))
  if (workflow) {
    fileInfo.definition = getWorkflowDefinition(workflow)
    fileInfo.workflowId = fileInfo.definition.id
  }

  return fileInfo
}
