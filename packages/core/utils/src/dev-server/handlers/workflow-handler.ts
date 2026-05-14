import {
  ResourceEntry,
  ResourceTypeHandler,
  WorkflowResourceData,
} from "../types"

export class WorkflowHandler
  implements ResourceTypeHandler<WorkflowResourceData>
{
  readonly type = "workflow"

  validate(data: WorkflowResourceData): void {
    if (!data.sourcePath) {
      throw new Error(
        `Workflow registration requires sourcePath. Received: ${JSON.stringify(
          data
        )}`
      )
    }

    if (!data.id) {
      throw new Error(
        `Workflow registration requires id. Received: ${JSON.stringify(data)}`
      )
    }
  }

  resolveSourcePath(data: WorkflowResourceData): string {
    return data.sourcePath
  }

  createEntry(data: WorkflowResourceData): ResourceEntry {
    return {
      id: data.id,
      workflowId: data.id,
    }
  }

  getInverseKey(data: WorkflowResourceData): string {
    return `${this.type}:${data.id}`
  }
}
