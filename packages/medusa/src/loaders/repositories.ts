import glob from "glob"
import path from "path"

import { asValue } from "awilix"
import { formatRegistrationName } from "medusa-core-utils"
import { MedusaContainer } from "../types/global"

/**
 * Registers all models in the model directory
 */
export default ({ container }: { container: MedusaContainer }): void => {
  const corePath = "../repositories/*.js"
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
