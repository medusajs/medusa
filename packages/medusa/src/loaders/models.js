import glob from "glob"
import path from "path"
import { EntitySchema } from "typeorm"
import { asClass, asValue } from "awilix"

import formatRegistrationName from "../utils/format-registration-name"

/**
 * Registers all models in the model directory
 */
export default ({ container }, config = { register: true }) => {
  const corePath = "../models/*.js"
  const coreFull = path.join(__dirname, corePath)

  const toReturn = []

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    const loaded = require(fn)

    Object.entries(loaded).map(([key, val]) => {
      if (typeof val === "function" || val instanceof EntitySchema) {
        if (config.register) {
          const name = formatRegistrationName(fn)
          container.register({
            [name]: asClass(val),
          })

          container.registerAdd("db_entities", asValue(val))
        }

        toReturn.push(val)
      }
    })
  })

  return toReturn
}
