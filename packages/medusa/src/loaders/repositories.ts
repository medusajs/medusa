import glob from "glob"
import path from "path"
import { asClass } from "awilix"

import formatRegistrationName from "../utils/format-registration-name"
import { ClassConstructor, MedusaContainer } from "../types/global"

/**
 * Registers all models in the model directory
 */
export default ({
  container,
  isTest,
}: {
  container: MedusaContainer
  isTest?: boolean
}): void => {
  const corePath = isTest ? "../repositories/*.ts" : "../repositories/*.js"
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    const loaded = require(fn) as ClassConstructor<unknown>

    Object.entries(loaded).map(
      ([, val]: [string, ClassConstructor<unknown>]) => {
        if (typeof val === "function") {
          const name = formatRegistrationName(fn)
          container.register({
            [name]: asClass(val),
          })
        }
      }
    )
  })
}
