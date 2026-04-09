import {
  globalDevServerRegistry,
  inverseDevServerRegistry,
  ResourceMap,
  ResourcePath,
} from "@medusajs/framework/utils"

export class ResourceRegistry {
  /**
   * Get resources registered for a given file path
   */
  getResources(filePath: string): ResourceMap | undefined {
    return globalDevServerRegistry.get(filePath)
  }

  /**
   * Get workflow source paths for a step resource
   */
  getWorkflowSourcePaths(stepId: string): ResourcePath[] | undefined {
    return inverseDevServerRegistry.get(`step:${stepId}`)
  }
}
