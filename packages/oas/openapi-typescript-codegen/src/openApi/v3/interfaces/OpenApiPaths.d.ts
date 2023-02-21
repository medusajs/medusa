import type { OpenApiPath } from "./OpenApiPath"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#pathsObject
 */
export interface OpenApiPaths {
  [path: string]: OpenApiPath
}
