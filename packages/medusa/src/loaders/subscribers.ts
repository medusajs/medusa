import glob from "glob"
import path from "path"
import { asFunction } from "awilix"
import { MedusaContainer } from "../types/global"

/**
 * Registers all subscribers in the subscribers directory
 */
export default ({ container }: { container: MedusaContainer }) => {
  const isTest = process.env.NODE_ENV === "test"

  const corePath = isTest
    ? "../subscribers/__mocks__/*.js"
    : "../subscribers/*.js"
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    const loaded = require(fn).default

    container.build(asFunction((cradle) => new loaded(cradle)).singleton())
  })
}
