import { asFunction, asValue } from "awilix"
import { trackInstallation } from "medusa-telemetry"
import { ConfigModule, Logger, MedusaContainer } from "../types/global"
import { ModulesHelper } from "../utils/module-helper"

type Options = {
  container: MedusaContainer
  configModule: ConfigModule
  logger: Logger
}

export const moduleHelper = new ModulesHelper()

export default async ({
  container,
  configModule,
  logger,
}: Options): Promise<void> => {
  const moduleResolutions = configModule?.moduleResolutions ?? {}

  for (const resolution of Object.values(moduleResolutions)) {
    try {
      if (!resolution.resolutionPath) {
        container.register({
          [resolution.definition.registrationName]: asFunction(
            () => false
          ).singleton(),
        })

        continue
      }

      const loadedModule = await import(resolution.resolutionPath!)

      const moduleService = loadedModule?.service || null

      if (!moduleService) {
        throw new Error(
          "No service found in module. Make sure that your module exports a service."
        )
      }

      const moduleLoaders = loadedModule?.loaders || []
      for (const loader of moduleLoaders) {
        await loader({ container, configModule, logger })
      }

      container.register({
        [resolution.definition.registrationName]: asFunction(
          (cradle) => new moduleService(cradle, resolution.options)
        ).singleton(),
      })

      const installation = {
        module: resolution.definition.key,
        resolution: resolution.resolutionPath,
      }

      trackInstallation(installation, "module")
    } catch (err) {
      if (resolution.definition.isRequired) {
        throw new Error(
          `Could not resolve required module: ${resolution.definition.label}.`
        )
      }

      logger.warn(`Could not resolve module: ${resolution.definition.label}.`)
    }
  }

  moduleHelper.setModules(
    Object.entries(moduleResolutions).reduce((acc, [k, v]) => {
      if (v.resolutionPath) {
        acc[k] = v
      }
      return acc
    }, {})
  )

  container.register({
    modulesHelper: asValue(moduleHelper),
  })
}
