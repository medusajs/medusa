import mergerJsonOptions from "../constants/merger-json-options.js"
import chalk from "chalk"
import generateReference from "../utils/generate-reference.js"

/**
 * Merges the per-reference TypeDoc JSON into the references doc-model
 * (`DocPage` JSON) under `www/apps/resources/references`. MDX output has been
 * retired — the site renders the JSON doc-model directly.
 */
export default async function merge() {
  console.log(chalk.bgBlueBright("\n\nRunning Merger (JSON doc-model)\n\n"))

  await generateReference({
    options: mergerJsonOptions,
    referenceName: "merge",
    outputType: "doc",
    startLog: false,
  })

  console.info(chalk.bgGreen("Finished merging references."))
}
