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
export const API_ROUTE_PARAM_REGEX = /\[(.+?)\]/g
/**
 * The schema associated with a tag whose name can't be inferred from the tag's name.
 * The key is the tag's area and name, and the value is the schema's name.
 *
 * For example, the `Views` tag of the admin area is associated with the
 * `AdminViewConfiguration` schema, whereas `AdminView` is inferred from its name.
 */
export const TAG_SCHEMA_NAME_OVERRIDES: {
  [areaAndTagName: string]: string
} = {
  "admin:Views": "AdminViewConfiguration",
}
// we can't use `{summary}` because it causes an MDX error
// when we finally render the summary. We can alternatively
// use `\{summary\}` but it wouldn't look pretty in the OAS,
// so doing this for now.
export const SUMMARY_PLACEHOLDER = "SUMMARY"
