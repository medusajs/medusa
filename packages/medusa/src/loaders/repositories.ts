import glob from "glob"
import path from "path"

import formatRegistrationName from "../utils/format-registration-name"
import { MedusaContainer } from "../types/global"
import { asValue } from "awilix"

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
    const loaded = require(fn).default

    if (typeof loaded === "object") {
      const name = formatRegistrationName(fn)
      container.register({
        [name]: asValue(loaded),
      })
    }
  })
}
