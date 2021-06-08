import glob from "glob"
import path from "path"
import { Lifetime, asClass, asValue } from "awilix"

import formatRegistrationName from "../utils/format-registration-name"

/**
 * Registers all models in the model directory
 */
export default ({ container }) => {
  let corePath = "../repositories/*.js"
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach(fn => {
    const loaded = require(fn)

    Object.entries(loaded).map(([key, val]) => {
      if (typeof val === "function") {
        const name = formatRegistrationName(fn)
        container.register({
          [name]: asClass(val),
        })
      }
    })
  })
}
