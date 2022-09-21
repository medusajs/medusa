import formatRegistrationName from "../utils/format-registration-name"
import glob from "glob"
import path from "path"
import { ClassConstructor, MedusaContainer } from "../types/global"
import { EntitySchema } from "typeorm"
import { asClass, asValue, AwilixContainer } from "awilix"

/**
 * Registers all models in the model directory
 */
export default (
  { container }: { container: MedusaContainer },
  config = { register: true }
) => {
  const corePath = "../models/*.js"
  const coreFull = path.join(__dirname, corePath)

  const models: (ClassConstructor<unknown> | EntitySchema)[] = []

  const core = glob.sync(coreFull, {
    cwd: __dirname,
    ignore: ["index.js", "index.ts"],
  })
  core.forEach((fn) => {
    const loaded = require(fn) as ClassConstructor<unknown> | EntitySchema
    if (loaded) {
      Object.entries(loaded).map(
        ([, val]: [string, ClassConstructor<unknown> | EntitySchema]) => {
          if (typeof val === "function" || val instanceof EntitySchema) {
            if (config.register) {
              const name = formatRegistrationName(fn)
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
