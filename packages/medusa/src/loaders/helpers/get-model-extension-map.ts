import glob from "glob"
import path from "path"
import { EntitySchema } from "typeorm"

import { formatRegistrationName } from "../../utils/format-registration-name"
import { ClassConstructor } from "../../types/global"

export function getModelExtensionsMap({
  directory,
  glob,
  config,
}) {
  const modelExtensionsMap = new Map()
  const globPath = directory ? path.join(directory, glob) : null
  const modelExtensions = globPath ? glob.sync(globPath, {
    ignore: ["index.js"],
  }) : []

  modelExtensions.forEach((modelExtensionPath) => {
    const extendedModel = require(modelExtensionPath) as ClassConstructor<unknown> | EntitySchema

    if (extendedModel) {
      Object.entries(extendedModel).map(
        ([, val]: [string, ClassConstructor<unknown> | EntitySchema]) => {
          if (typeof val === "function" || val instanceof EntitySchema) {
            if (config.register) {
              const name = formatRegistrationName(modelExtensionPath)

              modelExtensionsMap.set(name, val)
            }
          }
        }
      )
    }
  })

  return modelExtensionsMap
}