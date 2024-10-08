import { parse } from "yaml"
import { OpenApiOperation } from "../types/index.js"
import { DOCBLOCK_LINE_ASTRIX } from "../constants.js"

export type ExistingOas = {
  oas: OpenApiOperation
  oasPrefix: string
}

export default function parseOas(content: string): ExistingOas | undefined {
  content = content
    .replace(`/**\n`, "")
    .replaceAll(DOCBLOCK_LINE_ASTRIX, "")
    .replaceAll("*/", "")
    .trim()

  if (!content.startsWith("@oas")) {
    // the file is of an invalid format.
    return
  }

  // extract oas prefix line
  const splitNodeComments = content.split("\n")
  const oasPrefix = content.split("\n")[0]
  content = splitNodeComments.slice(1).join("\n")

  let oas: OpenApiOperation | undefined

  try {
    oas = parse(content) as OpenApiOperation
  } catch (e) {
    // couldn't parse the OAS, so consider it
    // not existent
  }

  return oas
    ? {
        oas,
        oasPrefix,
      }
    : undefined
}
