import { ResourceEntry, ResourceTypeHandler, StepResourceData } from "../types"

export class StepHandler implements ResourceTypeHandler<StepResourceData> {
  readonly type = "step"

  constructor(private inverseRegistry: Map<string, string[]>) {}

  validate(data: StepResourceData): void {
    if (!data.id) {
      throw new Error(
        `Step registration requires id. Received: ${JSON.stringify(data)}`
      )
    }

    if (!data.sourcePath && !data.workflowId) {
      throw new Error(
        `Step registration requires either sourcePath or workflowId. Received: ${JSON.stringify(
          data
        )}`
      )
    }
  }

  resolveSourcePath(data: StepResourceData): string {
    if (data.sourcePath) {
      return data.sourcePath
    }

    // Look up workflow's source path
    const workflowKey = `workflow:${data.workflowId}`
    const workflowSourcePaths = this.inverseRegistry.get(workflowKey)

    if (!workflowSourcePaths || workflowSourcePaths.length === 0) {
      throw new Error(
        `step workflow not found: ${data.workflowId} for step ${data.id}`
      )
    }

    return workflowSourcePaths[0]
  }

  createEntry(data: StepResourceData): ResourceEntry {
    return {
      id: data.id,
      workflowId: data.workflowId,
    }
  }

  getInverseKey(data: StepResourceData): string {
    return `${this.type}:${data.id}`
  }
}
