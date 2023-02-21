import type { Dictionary } from "../../../utils/types"
import type { OpenApiExample } from "./OpenApiExample"
import type { OpenApiReference } from "./OpenApiReference"
import type { OpenApiSchema } from "./OpenApiSchema"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#headerObject
 */
export interface OpenApiHeader extends OpenApiReference {
  description?: string
  required?: boolean
  deprecated?: boolean
  allowEmptyValue?: boolean
  style?: string
  explode?: boolean
  allowReserved?: boolean
  schema?: OpenApiSchema
  example?: any
  examples?: Dictionary<OpenApiExample>
}
