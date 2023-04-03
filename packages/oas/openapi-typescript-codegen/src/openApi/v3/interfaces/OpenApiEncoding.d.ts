import type { Dictionary } from "../../../utils/types"
import type { OpenApiHeader } from "./OpenApiHeader"

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#encodingObject
 */
export interface OpenApiEncoding {
  contentType?: string
  headers?: Dictionary<OpenApiHeader>
  style?: string
  explode?: boolean
  allowReserved?: boolean
}
