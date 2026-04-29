import { JobResourceData, ResourceEntry, ResourceTypeHandler } from "../types"

export class JobHandler implements ResourceTypeHandler<JobResourceData> {
  readonly type = "job"

  validate(data: JobResourceData): void {
    if (!data.id) {
      throw new Error(
        `Job registration requires id. Received: ${JSON.stringify(data)}`
      )
    }

    if (!data.sourcePath) {
      throw new Error(
        `Job registration requires sourcePath. Received: ${JSON.stringify(
          data
        )}`
      )
    }

    if (!data.config?.name) {
      throw new Error(
        `Job registration requires config.name. Received: ${JSON.stringify(
          data
        )}`
      )
    }
  }

  resolveSourcePath(data: JobResourceData): string {
    return data.sourcePath
  }

  createEntry(data: JobResourceData): ResourceEntry {
    return {
      id: data.id,
      config: data.config,
    }
  }

  getInverseKey(data: JobResourceData): string {
    return `${this.type}:${data.config?.name}`
  }
}
