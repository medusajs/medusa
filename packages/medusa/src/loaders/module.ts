import { asValue } from "awilix"
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
  for (const [_, resolution] of Object.entries(moduleResolutions)) {
    if (resolution.shouldResolve) {
      try {
        const loadedModule = await import(resolution.resolutionPath!)
        console.log(resolution)
        const moduleLoaders = loadedModule.loaders
        if (moduleLoaders) {
          await Promise.all(
            moduleLoaders.map(
              async (loader: (opts: Options) => Promise<void>) => {
                return loader({ container, configModule, logger })
              }
            )
          )
        }
      } catch (err) {
        console.log(err)
        console.log("Couldn't resolve loaders", resolution.settings.label)
      }
    } else {
      container.register({
        [resolution.settings.registration]: asValue(false),
      })
    }
  }
}
