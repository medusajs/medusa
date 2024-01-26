import glob from "glob"
import path from "path"
import { EntitySchema } from "typeorm"

import { formatRegistrationName } from "../../utils/format-registration-name"
import { ClassConstructor } from "../../types/global"

type GetModelExtensionMapParams = {
  directory?: string
  pathGlob?: string
  config: Record<string, any>
}

export function getModelExtensionsMap({
  directory,
  pathGlob,
  config = {},
}: GetModelExtensionMapParams): Map<
  string,
  ClassConstructor<unknown> | EntitySchema
> {
  const modelExtensionsMap = new Map<
    string,
    ClassConstructor<unknown> | EntitySchema
  >()
  const fullPathGlob =
    directory && pathGlob ? path.join(directory, pathGlob) : null

  const modelExtensions = fullPathGlob
    ? glob.sync(fullPathGlob, {
        cwd: directory,
        ignore: ["index.js", "index.js.map"],
      })
    : []

  modelExtensions.forEach((modelExtensionPath) => {
    const extendedModel = require(modelExtensionPath) as
      | ClassConstructor<unknown>
      | EntitySchema
      | undefined

    if (extendedModel) {
      Object.entries(extendedModel).map(
        ([_key, val]: [string, ClassConstructor<unknown> | EntitySchema]) => {
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
