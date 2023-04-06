import { OpenAPIObject, TagObject } from "openapi3-ts"

export function mergeBaseIntoOAS(
  targetOAS: OpenAPIObject,
  sourceOAS: OpenAPIObject
): void {
  /**
   * replace strategy for OpenAPIObject properties
   */
  targetOAS.openapi = sourceOAS.openapi ?? targetOAS.openapi
  targetOAS.info = sourceOAS.info ?? targetOAS.info
  targetOAS.servers = sourceOAS.servers ?? targetOAS.servers
  targetOAS.security = sourceOAS.security ?? targetOAS.security
  targetOAS.externalDocs = sourceOAS.externalDocs ?? targetOAS.externalDocs
  targetOAS.webhooks = sourceOAS.webhooks ?? targetOAS.webhooks
  /**
   * merge + concat strategy for tags
   */
  const targetTags = targetOAS.tags ?? []
  const sourceTags = sourceOAS.tags ?? []
  const combinedTags: TagObject[] = []
  const sourceIndexes: number[] = []
  for (const targetTag of targetTags) {
    for (const [sourceTagIndex, sourceTag] of sourceTags.entries()) {
      if (targetTag.name === sourceTag.name) {
        combinedTags.push(sourceTag)
        sourceIndexes.push(sourceTagIndex)
        continue
      }
      combinedTags.push(targetTag)
    }
  }
  for (const [sourceTagIndex, sourceTag] of sourceTags.entries()) {
    if (!sourceIndexes.includes(sourceTagIndex)) {
      combinedTags.push(sourceTag)
    }
  }
  targetOAS.tags = combinedTags
  /**
   * merge strategy for paths
   */
  targetOAS.paths = Object.assign(targetOAS.paths ?? {}, sourceOAS.paths ?? {})
  /**
   * merge strategy for components
   */
  if (!sourceOAS.components) {
    return
  }
  if (!targetOAS.components) {
    targetOAS.components = {}
  }
  for (const componentGroup of [
    "callbacks",
    "examples",
    "headers",
    "links",
    "parameters",
    "requestBodies",
    "responses",
    "schemas",
    "securitySchemes",
  ]) {
    if (Object.keys(sourceOAS.components).includes(componentGroup)) {
      targetOAS.components[componentGroup] = Object.assign(
        targetOAS.components[componentGroup] ?? {},
        sourceOAS.components[componentGroup]
      )
    }
  }
}

export function mergePathsAndSchemasIntoOAS(
  targetOAS: OpenAPIObject,
  sourceOAS: OpenAPIObject
): void {
  /**
   * merge paths
   */
  Object.assign(targetOAS.paths, sourceOAS.paths)

  /**
   * merge components.schemas
   */
  if (sourceOAS.components?.schemas) {
    if (!targetOAS.components) {
      targetOAS.components = {}
    }
    if (!targetOAS.components.schemas) {
      targetOAS.components.schemas = {}
    }
    Object.assign(targetOAS.components.schemas, sourceOAS.components.schemas)
  }
}
