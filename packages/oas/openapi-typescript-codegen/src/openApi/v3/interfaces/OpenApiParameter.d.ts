import type { Dictionary } from "../../../utils/types"
import type { OpenApiExample } from "./OpenApiExample"
import type { OpenApiReference } from "./OpenApiReference"
import type { OpenApiSchema } from "./OpenApiSchema"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#parameterObject
 */
export interface OpenApiParameter extends OpenApiReference {
  name: string
  in: "path" | "query" | "header" | "formData" | "cookie"
  description?: string
  required?: boolean
  nullable?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: string
  explode?: boolean
  allowReserved?: boolean
  schema?: OpenApiSchema
  example?: any
  examples?: Dictionary<OpenApiExample>
}
