import { asFunction, asValue } from "awilix"
import { trackInstallation } from "medusa-telemetry"
import { LoaderOptions, ModuleExports } from "../types/global"
import { ModulesHelper } from "../utils/module-helper"

export const moduleHelper = new ModulesHelper()

export default async ({
  container,
  configModule,
  logger,
}: LoaderOptions): Promise<void> => {
  const moduleResolutions = configModule?.moduleResolutions ?? {}

  for (const resolution of Object.values(moduleResolutions)) {
    try {
      const { default: loadedModule }: { default: ModuleExports } =
        await import(resolution.resolutionPath!)

      const moduleLoaders = loadedModule?.loaders || []
      for (const loader of moduleLoaders) {
        await loader({ container, configModule, logger })
      }

      const moduleServices = loadedModule?.services || []

      for (const service of moduleServices) {
        container.register({
          [resolution.definition.registrationName]: asFunction(
            (cradle) => new service(cradle, configModule)
          ).singleton(),
        })
      }

      const installation = {
        module: resolution.definition.key,
        resolution: resolution.resolutionPath,
      }

      trackInstallation(installation, "module")
    } catch (err) {
      if (resolution.definition.isRequired) {
        logger.warn(`Could not resolve module: ${resolution.definition.label}`)
        throw err // throw error from module loader on required modules
      }

      logger.warn(`Could not resolve module: ${resolution.definition.label}`)
    }
  }

  moduleHelper.setModules(moduleResolutions)

  container.register({
    modulesHelper: asValue(moduleHelper),
  })
}
