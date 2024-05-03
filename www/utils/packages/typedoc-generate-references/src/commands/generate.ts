import chalk from "chalk"
import customOptions from "../constants/custom-options.js"
import allReferences from "../constants/references.js"
import getModuleOptions from "../utils/get-module-options.js"
import getReferenceType from "../utils/get-reference-type.js"
import merge from "./merge.js"
import { customModulesOptions } from "../constants/references-details.js"
import formatColoredLog from "../utils/format-colored-logs.js"
import generateReference from "../utils/generate-reference.js"
import getModelOptions from "../utils/get-model-options.js"

type Options = {
  merge: boolean
}

export default async function generate(
  names: string[],
  { merge: mergeOption }: Options
) {
  const references = names.includes("all") ? allReferences : names

  for (const referenceName of references) {
    const referenceType = getReferenceType(referenceName)
    try {
      if (referenceType === "module") {
        const moduleOptions = getModuleOptions({
          moduleName: referenceName,
          typedocOptions: Object.hasOwn(customModulesOptions, referenceName)
            ? customModulesOptions[referenceName]
            : undefined,
        })

        await generateReference({
          options: moduleOptions,
          referenceName,
          outputType: "json",
        })

        const modelOptions = getModelOptions({
          moduleName: referenceName,
        })

        try {
          await generateReference({
            options: modelOptions,
            referenceName: `${referenceName}-models`,
            outputType: "json",
          })
        } catch (e) {
          formatColoredLog({
            chalkInstance: chalk.bgRed,
            title: `Error generating for ${referenceName} models`,
            message: e as string,
          })
        }
      } else {
        const options = Object.hasOwn(customOptions, referenceName)
          ? customOptions[referenceName]
          : undefined

        await generateReference({
          options,
          referenceName,
          outputType: "json",
        })
      }
    } catch (e) {
      formatColoredLog({
        chalkInstance: chalk.bgRed,
        title: `Error generating for ${referenceName}`,
        message: e as string,
      })
    }
  }

  console.info(chalk.bgGreen("Finished generating references."))

  if (mergeOption) {
    await merge()
  }
}
