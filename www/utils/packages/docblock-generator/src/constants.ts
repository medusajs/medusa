import { OpenAPIV3 } from "openapi-types"

export const DOCBLOCK_LINE_ASTRIX = " * "
export const DOCBLOCK_NEW_LINE = `\n${DOCBLOCK_LINE_ASTRIX}`
export const DOCBLOCK_START = `*${DOCBLOCK_NEW_LINE}`
export const DOCBLOCK_END_LINE = "\n"
export const DOCBLOCK_DOUBLE_LINES = `${DOCBLOCK_NEW_LINE}${DOCBLOCK_NEW_LINE}`
export const DEFAULT_OAS_RESPONSES: {
  [k: string]: OpenAPIV3.ReferenceObject
} = {
  "400": {
    $ref: "#/components/responses/400_error",
  },
  "401": {
    $ref: "#/components/responses/unauthorized",
  },
  "404": {
    $ref: "#/components/responses/not_found_error",
  },
  "409": {
    $ref: "#/components/responses/invalid_state_error",
  },
  "422": {
    $ref: "#/components/responses/invalid_request_error",
  },
  "500": {
    $ref: "#/components/responses/500_error",
  },
}
