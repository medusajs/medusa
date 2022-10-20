<<<<<<< HEAD
import { asValue } from "awilix"
import { ConfigModule, Logger, MedusaContainer } from "../types/global"
=======
import { asValue, asFunction } from "awilix"
import { ConfigModule, MedusaContainer } from "../types/global"
>>>>>>> 5341b0e9d (fix: integration test of inventory)

type Options = {
  container: MedusaContainer
  configModule: ConfigModule
<<<<<<< HEAD
  logger: Logger
}

export default async ({
  container,
  configModule,
  logger,
}: Options): Promise<void> => {
=======
}

export default async ({ container, configModule }: Options): Promise<void> => {
>>>>>>> 5341b0e9d (fix: integration test of inventory)
  const moduleResolutions = configModule?.moduleResolutions ?? {}
  for (const [_, resolution] of Object.entries(moduleResolutions)) {
    if (resolution.shouldResolve) {
      try {
        const loadedModule = await import(resolution.resolutionPath!)
<<<<<<< HEAD
        console.log(resolution)
=======
>>>>>>> 5341b0e9d (fix: integration test of inventory)
        const moduleLoaders = loadedModule.loaders
        if (moduleLoaders) {
          await Promise.all(
            moduleLoaders.map(
              async (loader: (opts: Options) => Promise<void>) => {
<<<<<<< HEAD
                return loader({ container, configModule, logger })
=======
                return loader({ container, configModule })
>>>>>>> 5341b0e9d (fix: integration test of inventory)
              }
            )
          )
        }
      } catch (err) {
<<<<<<< HEAD
        console.log(err)
=======
>>>>>>> 5341b0e9d (fix: integration test of inventory)
        console.log("Couldn't resolve loaders", resolution.settings.label)
      }
    } else {
      container.register({
        [resolution.settings.registration]: asValue(false),
      })
    }
  }
}
