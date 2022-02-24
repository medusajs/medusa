import glob from "glob"
import path from "path"
import { asFunction } from "awilix"

import formatRegistrationName from "../utils/format-registration-name"

/**
 * Registers all controllers in the controllers directory
 */
export default ({ container, configModule }) => {
  const isTest = process.env.NODE_ENV === "test"

  const corePath = isTest
    ? "../controllers/__mocks__/*.js"
    : "../controllers/**.js"
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    const loaded = require(fn).default
    if (loaded) {
      const name = formatRegistrationName(fn)
      console.log(name)
      container.register({
        [name]: asFunction(
          (cradle) => new loaded(cradle, configModule)
        ).singleton(),
      })
    }
  })
}
