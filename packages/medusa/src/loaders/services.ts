import { asFunction } from "awilix"
import glob from "glob"
import path from "path"
import { ConfigModule, MedusaContainer } from "../types/global"
import { isDefined } from "medusa-core-utils"
import formatRegistrationName from "../utils/format-registration-name"

type Options = {
  container: MedusaContainer
  configModule: ConfigModule
  isTest?: boolean
}

/**
 * Registers all services in the services directory
 */
export default ({ container, configModule, isTest }: Options): void => {
  const useMock = isDefined(isTest) ? isTest : process.env.NODE_ENV === "test"

  const corePath = useMock ? "../services/__mocks__/*.js" : "../services/*.js"
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    const loaded = require(fn).default
    if (loaded) {
      const name = formatRegistrationName(fn)
      container.register({
        [name]: asFunction(
          (cradle) => new loaded(cradle, configModule)
        ).singleton(),
      })
    }
  })
}
