import glob from "glob"
import path from "path"
import { AwilixContainer, asFunction } from "awilix"

import formatRegistrationName from "../utils/format-registration-name"

type LoaderOptions = {
  container: AwilixContainer
  configModule: object
  isTest: boolean
}

/**
 * Registers all strategies in the strategies directory
 * @returns void
 */
export default ({ container, configModule, isTest }: LoaderOptions): void => {
  const useMock =
    typeof isTest !== "undefined" ? isTest : process.env.NODE_ENV === "test"

  const corePath = useMock
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
