import type { OpenApiExternalDocs } from "./OpenApiExternalDocs"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#tagObject
 */
export interface OpenApiTag {
  name: string
  description?: string
  externalDocs?: OpenApiExternalDocs
}
