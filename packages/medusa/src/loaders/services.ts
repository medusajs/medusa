import glob from "glob"
import path from "path"
import { asValue, asFunction } from "awilix"
import formatRegistrationName from "../utils/format-registration-name"
import { ConfigModule, MedusaContainer } from "../types/global"
import { isDefined } from "../utils"

type Options = {
  container: MedusaContainer
  configModule: ConfigModule
  isTest?: boolean
}

/**
 * Registers all services in the services directory
 */
export default async ({
  container,
  configModule,
  isTest,
}: Options): Promise<void> => {
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

  const moduleResolutions = configModule?.moduleResolutions ?? {}
  for (const [_, resolution] of Object.entries(moduleResolutions)) {
    if (resolution.shouldResolve) {
      try {
        const loadedModule = await import(resolution.resolutionPath!)
        const loadedService = loadedModule.service
        container.register({
          [resolution.settings.registration]: asFunction(
            (cradle) => new loadedService(cradle, configModule)
          ).singleton(),
        })
      } catch (err) {
        console.log("Couldn't resolve", resolution.resolutionPath)
        container.register({
          [resolution.settings.registration]: asValue(false),
        })
      }
    } else {
      container.register({
        [resolution.settings.registration]: asValue(false),
      })
    }
  }
}
