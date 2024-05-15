import mergerOptions from "../constants/merger-options.js"
import chalk from "chalk"
import generateReference from "../utils/generate-reference.js"

export default async function merge() {
  console.log(chalk.bgBlueBright("\n\nRunning Merger\n\n"))

  await generateReference({
    options: mergerOptions,
    referenceName: "merge",
    outputType: "doc",
    startLog: false,
  })

  console.info(chalk.bgGreen("Finished merging references."))
}
