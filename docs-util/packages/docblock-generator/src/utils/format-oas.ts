import { stringify } from "yaml"
import { DOCBLOCK_END_LINE, DOCBLOCK_NEW_LINE } from "../constants.js"
import { OpenApiOperation, OpenApiSchema } from "../types/index.js"

/**
 * Retrieve the OAS as a formatted string that can be used as a comment.
 *
 * @param oas - The OAS operation to format.
 * @param oasPrefix - The OAS prefix that's used before the OAS operation.
 * @returns The formatted OAS comment.
 */
export default function formatOas(
  oas: OpenApiOperation | OpenApiSchema,
  oasPrefix: string
) {
  return `* ${oasPrefix}${DOCBLOCK_NEW_LINE}${stringify(oas).replaceAll(
    "\n",
    DOCBLOCK_NEW_LINE
  )}${DOCBLOCK_END_LINE}`
}
