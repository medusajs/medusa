import { asValue, asFunction } from "awilix"
import { ConfigModule, MedusaContainer } from "../types/global"

type Options = {
  container: MedusaContainer
  configModule: ConfigModule
}

export default async ({ container, configModule }: Options): Promise<void> => {
  const moduleResolutions = configModule?.moduleResolutions ?? {}
  for (const [_, resolution] of Object.entries(moduleResolutions)) {
    if (resolution.shouldResolve) {
      try {
        const loadedModule = await import(resolution.resolutionPath!)
        const moduleLoaders = loadedModule.loaders
        if (moduleLoaders) {
          await Promise.all(
            moduleLoaders.map(
              async (loader: (opts: Options) => Promise<void>) => {
                return loader({ container, configModule })
              }
            )
          )
        }
      } catch (err) {
        console.log("Couldn't resolve loaders", resolution.settings.label)
      }
    } else {
      container.register({
        [resolution.settings.registration]: asValue(false),
      })
    }
  }
}
