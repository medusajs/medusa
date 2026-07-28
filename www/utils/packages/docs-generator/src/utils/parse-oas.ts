import chalk from "chalk"
import { parse } from "yaml"
import { OpenApiOperation } from "../types/index.js"
import docblockToYaml from "./docblock-to-yaml.js"

export type ExistingOas = {
  oas: OpenApiOperation
  oasPrefix: string
}

export default function parseOas(content: string): ExistingOas | undefined {
  content = docblockToYaml(content)

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
    // couldn't parse the OAS, so consider it not existent. This means the OAS is
    // generated again from scratch, losing any changes that were made manually to
    // it, so warn about it.
    console.warn(
      chalk.yellow(
        `[OAS] Couldn't parse the existing OAS of ${oasPrefix}, so it's generated again: ${e}`
      )
    )
  }

  return oas
    ? {
        oas,
        oasPrefix,
      }
    : undefined
}
