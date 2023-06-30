import {
  formatRegistrationName,
  formatRegistrationNameWithoutNamespace,
} from "../utils/format-registration-name"
import { getModelExtensionsMap } from "./helpers/get-model-extension-map"
import glob from "glob"
import path from "path"
import { ClassConstructor, MedusaContainer } from "../types/global"
import { EntitySchema } from "typeorm"
import { asClass, asValue } from "awilix"
import { upperCaseFirst } from "@medusajs/utils"

type ModelLoaderParams = {
  container: MedusaContainer
  isTest?: boolean
  rootDirectory?: string
  corePathGlob?: string
  coreTestPathGlob?: string
  extensionPathGlob?: string
}
/**
 * Registers all models in the model directory
 */
export default (
  {
    container,
    isTest,
    rootDirectory,
    corePathGlob = "../models/*.js",
    coreTestPathGlob = "../models/*.ts",
    extensionPathGlob = "dist/models/*.js",
  }: ModelLoaderParams,
  config = { register: true }
) => {
  const coreModelsGlob = isTest ? coreTestPathGlob : corePathGlob
  const coreModelsFullGlob = path.join(__dirname, coreModelsGlob)
  const models: (ClassConstructor<unknown> | EntitySchema)[] = []

  const coreModels = glob.sync(coreModelsFullGlob, {
    cwd: __dirname,
    ignore: ["index.js", "index.ts", "index.js.map"],
  })

  const modelExtensionsMap = getModelExtensionsMap({
    directory: rootDirectory,
    pathGlob: extensionPathGlob,
    config,
  })

  // Override the core entities first before they are loading to be sure
  // that the other related entities are consuming the correct extended model
  modelExtensionsMap.forEach((val, key) => {
    coreModels.find((modelPath) => {
      const loaded = require(modelPath) as
        | ClassConstructor<unknown>
        | EntitySchema

      if (loaded) {
        const name = formatRegistrationName(modelPath)
        const mappedExtensionModel = modelExtensionsMap.get(name)
        if (mappedExtensionModel) {
          const coreModel = require(modelPath)
          const modelName = upperCaseFirst(
            formatRegistrationNameWithoutNamespace(modelPath)
          )

          coreModel[modelName] = mappedExtensionModel
        }
      }
    })
  })

  coreModels.forEach((modelPath) => {
    const loaded = require(modelPath) as
      | ClassConstructor<unknown>
      | EntitySchema

    if (loaded) {
      Object.entries(loaded).map(
        ([, val]: [string, ClassConstructor<unknown> | EntitySchema]) => {
          if (typeof val === "function" || val instanceof EntitySchema) {
            if (config.register) {
              const name = formatRegistrationName(modelPath)

              container.register({
                [name]: asClass(val as ClassConstructor<unknown>),
              })

              container.registerAdd("db_entities", asValue(val))
            }

            models.push(val)
          }
        }
      )
    }
  })

  return models
}
