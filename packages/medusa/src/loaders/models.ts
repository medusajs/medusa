import { formatRegistrationName, formatRegistrationNameWithoutNamespace } from "../utils/format-registration-name"
import { getModelExtensionsMap } from './helpers/get-model-extension-map'
import glob from "glob"
import path from "path"
import { ClassConstructor, MedusaContainer } from "../types/global"
import { EntitySchema } from "typeorm"
import { asClass, asValue } from "awilix"

/**
 * Registers all models in the model directory
 */
export default (
  { container, isTest, rootDirectory }: { container: MedusaContainer; isTest?: boolean, rootDirectory?: string },
  config = { register: true }
) => {
  const coreModelsGlob = isTest ? "../models/*.ts" : "../models/*.js"
  const coreModelsFullGlob = path.join(__dirname, coreModelsGlob)
  const models: (ClassConstructor<unknown> | EntitySchema)[] = []

  const coreModels = glob.sync(coreModelsFullGlob, {
    cwd: __dirname,
    ignore: ["index.js", "index.ts"],
  })

  const modelExtensionsMap = getModelExtensionsMap({
    directory: rootDirectory,
    pathGlob: "dist/models/*.js",
    config,
  })

  coreModels.forEach((modelPath) => {
    const loaded = require(modelPath) as ClassConstructor<unknown> | EntitySchema

    if (loaded) {
      Object.entries(loaded).map(
        ([, val]: [string, ClassConstructor<unknown> | EntitySchema]) => {
          if (typeof val === "function" || val instanceof EntitySchema) {
            if (config.register) {
              const name = formatRegistrationName(modelPath)

              // If an extension file is found, override it with that instead
              if (modelExtensionsMap.get(name)) {
                const coreModel = require(modelPath)
                const modelName = formatRegistrationNameWithoutNamespace(modelPath)

                coreModel[modelName] = modelExtensionsMap.get(name)
                val = modelExtensionsMap.get(name)
              }

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
