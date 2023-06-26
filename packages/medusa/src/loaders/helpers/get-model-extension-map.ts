import glob from "glob"
import path from "path"
import { EntitySchema } from "typeorm"

import { formatRegistrationName } from "../../utils/format-registration-name"
import { ClassConstructor } from "../../types/global"

export function getModelExtensionsMap({
  directory,
  pathGlob,
  config,
}) {
  const modelExtensionsMap = new Map()
  const fullPathGlob = directory ? path.join(directory, pathGlob) : null
  const modelExtensions = fullPathGlob ? glob.sync(fullPathGlob, {
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