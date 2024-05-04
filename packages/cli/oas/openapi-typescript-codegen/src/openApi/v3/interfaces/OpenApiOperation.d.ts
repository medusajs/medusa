import type { Dictionary } from "../../../utils/types"
import type { OpenApiCallback } from "./OpenApiCallback"
import type { OpenApiExternalDocs } from "./OpenApiExternalDocs"
import type { OpenApiParameter } from "./OpenApiParameter"
import type { OpenApiRequestBody } from "./OpenApiRequestBody"
import type { OpenApiResponses } from "./OpenApiResponses"
import type { OpenApiSecurityRequirement } from "./OpenApiSecurityRequirement"
import type { OpenApiServer } from "./OpenApiServer"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#operationObject
 */
export interface OpenApiOperation {
  tags?: string[]
  summary?: string
  description?: string
  externalDocs?: OpenApiExternalDocs
  operationId?: string
  parameters?: OpenApiParameter[]
  requestBody?: OpenApiRequestBody
  responses: OpenApiResponses
  callbacks?: Dictionary<OpenApiCallback>
  deprecated?: boolean
  security?: OpenApiSecurityRequirement[]
  servers?: OpenApiServer[]
  "x-codegen"?: Record<string, unknown>
}
