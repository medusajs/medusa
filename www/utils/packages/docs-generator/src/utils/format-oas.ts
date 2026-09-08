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
  return `* ${oasPrefix}${DOCBLOCK_NEW_LINE}${stringify(oas, {
    lineWidth: 200,
    // keep multiline strings as literal blocks. Otherwise, they're written as folded
    // blocks that wrap their content, which changes how an OAS with a multi-paragraph
    // description is written every time it's formatted again.
    blockQuote: "literal",
  }).replaceAll("\n", DOCBLOCK_NEW_LINE)}${DOCBLOCK_END_LINE}`
}
