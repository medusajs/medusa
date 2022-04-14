import glob from "glob"
import path from "path"
import { asFunction } from "awilix"
import formatRegistrationName from "../utils/format-registration-name"
import { MedusaContainer } from "../types/global"
import { ConfigModule } from "./index"

type Options = {
  container: MedusaContainer;
  configModule: ConfigModule
  isTest: boolean;
}

/**
 * Registers all services in the services directory
 */
export default ({ container, configModule, isTest }: Options): void => {
  const useMock =
    typeof isTest !== "undefined" ? isTest : process.env.NODE_ENV === "test"

  const corePath = useMock ? "../services/__mocks__/*.js" : "../services/**/!(index|interfaces).js"
  const coreFull = path.join(__dirname, corePath)

  const core = glob.sync(coreFull, { cwd: __dirname })
  core.forEach((fn) => {
    const loaded = require(fn).default
    if (loaded) {
      /*
       * Since the name is built based on the directory structure, in order to be able to manage sub directories
       * into the services directory, we have to re build the path from dist in order to keep
       * the formatRegistrationName to work.
       * TODO: See how that could be improved without breaking changes
       */
      const pathSegments = fn.split('/')
      const computedPath = pathSegments
        .splice(
          0,
          pathSegments.indexOf(isTest ? 'src' : 'dist') + 2
        ).join('/') + '/' + pathSegments[pathSegments.length - 1]
      const name = formatRegistrationName(computedPath)
      container.register({
        [name]: asFunction(
          (cradle) => new loaded(cradle, configModule)
        ).singleton(),
      })
    }
  })
}
