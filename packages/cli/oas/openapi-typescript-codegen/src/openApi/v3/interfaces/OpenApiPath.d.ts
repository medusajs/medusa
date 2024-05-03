import type { OpenApiOperation } from "./OpenApiOperation"
import type { OpenApiParameter } from "./OpenApiParameter"
import type { OpenApiServer } from "./OpenApiServer"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#pathItemObject
 */
export interface OpenApiPath {
  summary?: string
  description?: string
  get?: OpenApiOperation
  put?: OpenApiOperation
  post?: OpenApiOperation
  delete?: OpenApiOperation
  options?: OpenApiOperation
  head?: OpenApiOperation
  patch?: OpenApiOperation
  trace?: OpenApiOperation
  servers?: OpenApiServer[]
  parameters?: OpenApiParameter[]
}
