import glob from "glob"
import path from "path"
import { asFunction } from "awilix"
import { MedusaContainer } from "../types/global"
import { MedusaError } from "@medusajs/utils"

/**
 * Registers all subscribers in the subscribers directory
 */
export default ({ container }: { container: MedusaContainer }) => {
  const corePath = "../subscribers/*.js"
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    const loaded = require(fn).default
    if (!loaded) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Subscriber ${fn} does not have a default export`
      )
    }

    container.build(asFunction((cradle) => new loaded(cradle)).singleton())
  })
}
