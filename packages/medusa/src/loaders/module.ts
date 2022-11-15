import { asFunction } from "awilix"
import { ConfigModule, Logger, MedusaContainer } from "../types/global"

type Options = {
  container: MedusaContainer
  configModule: ConfigModule
  logger: Logger
}

export default async ({
  container,
  configModule,
  logger,
}: Options): Promise<void> => {
  const moduleResolutions = configModule?.moduleResolutions ?? {}

  for (const resolution of Object.values(moduleResolutions)) {
    try {
      const loadedModule = await import(resolution.resolutionPath!)

      const moduleLoaders = loadedModule.loaders
      if (moduleLoaders) {
        for (const loader of moduleLoaders) {
          await loader({ container, configModule, logger })
        }
      }

      const moduleServices = loadedModule.services

      if (moduleServices) {
        for (const service of moduleServices) {
          container.register({
            [resolution.definition.registrationName]: asFunction(
              (cradle) => new service(cradle, configModule)
            ).singleton(),
          })
        }
      }
    } catch (err) {
      console.log("Couldn't resolve module: ", resolution.definition.label)
    }
  }
}
