import DocblockGenerator from "../classes/generators/docblock.js"
import { Options } from "../classes/generators/index.js"
import OasGenerator from "../classes/generators/oas.js"
import { CommonCliOptions } from "../types/index.js"

export default async function run(
  paths: string[],
  { type, ...options }: Omit<Options, "paths"> & CommonCliOptions
) {
  console.log("Running...")

  if (type === "all" || type === "docs") {
    const docblockGenerator = new DocblockGenerator({
      paths,
      ...options,
    })

    await docblockGenerator.run()
  }

  if (type === "all" || type === "oas") {
    const oasGenerator = new OasGenerator({
      paths,
      ...options,
    })

    await oasGenerator.run()
  }

  console.log(`Finished running.`)
}
