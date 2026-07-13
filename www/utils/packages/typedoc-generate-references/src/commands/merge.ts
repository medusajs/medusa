import mergerOptions from "../constants/merger-options.js"
import mergerJsonOptions from "../constants/merger-json-options.js"
import chalk from "chalk"
import generateReference from "../utils/generate-reference.js"

export type MergeFormat = "mdx" | "json" | "both"

export default async function merge(format: MergeFormat = "mdx") {
  if (format === "mdx" || format === "both") {
    console.log(chalk.bgBlueBright("\n\nRunning Merger (MDX)\n\n"))

    await generateReference({
      options: mergerOptions,
      referenceName: "merge",
      outputType: "doc",
      startLog: false,
    })
  }

  if (format === "json" || format === "both") {
    console.log(chalk.bgBlueBright("\n\nRunning Merger (JSON doc-model)\n\n"))

    await generateReference({
      options: mergerJsonOptions,
      referenceName: "merge-json",
      outputType: "doc",
      startLog: false,
    })
  }

  console.info(chalk.bgGreen("Finished merging references."))
}
