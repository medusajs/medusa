import glob from "glob"
import path from "path"
import { AwilixContainer, asFunction } from "awilix"

import formatRegistrationName from "../utils/format-registration-name"

type LoaderOptions = {
  container: AwilixContainer
  configModule: object
}

/**
 * Registers all services in the services directory
 */
export default ({ container, configModule }: LoaderOptions): void => {
  const isTest = process.env.NODE_ENV === "test"

  const corePath = isTest
    ? "../strategies/__mocks__/*.js"
    : "../strategies/*.js"
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require(fn).default
    const name = formatRegistrationName(fn)
    container.register({
      [name]: asFunction(
        (cradle) => new loaded(cradle, configModule)
      ).singleton(),
    })
  })
}
