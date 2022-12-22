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

const registerModule = async (
  container,
  resolution,
  configModule,
  logger
): Promise<{ error?: Error } | void> => {
  if (!resolution.resolutionPath) {
    container.register({
      [resolution.definition.registrationName]: asValue(false),
    })

    return
  }

  let loadedModule
  try {
    loadedModule = await import(resolution.resolutionPath!)
  } catch (error) {
    return { error }
  }

  const moduleService = loadedModule?.service || null

  if (!moduleService) {
    return {
      error: new Error(
        "No service found in module. Make sure that your module exports a service."
      ),
    }
  }

  const moduleLoaders = loadedModule?.loaders || []
  try {
    for (const loader of moduleLoaders) {
      await loader({ container, configModule, logger })
    }
  } catch (err) {
    return {
      error: new Error(
        `Loaders for module ${resolution.definition.label} failed: ${err.message}`
      ),
    }
  }

  container.register({
    [resolution.definition.registrationName]: asFunction(
      (cradle) => new moduleService(cradle, resolution.options)
    ).singleton(),
  })

  trackInstallation(
    {
      module: resolution.definition.key,
      resolution: resolution.resolutionPath,
    },
    "module"
  )
}

export default async ({
  container,
  configModule,
  logger,
}: Options): Promise<void> => {
  const moduleResolutions = configModule?.moduleResolutions ?? {}

  for (const resolution of Object.values(moduleResolutions)) {
    const registrationResult = await registerModule(
      container,
      resolution,
      configModule,
      logger
    )
    if (registrationResult?.error) {
      const { error } = registrationResult
      if (resolution.definition.isRequired) {
        logger.warn(
          `Could not resolve required module: ${resolution.definition.label}. Error: ${error.message}`
        )
        throw error
      }

      logger.warn(
        `Could not resolve module: ${resolution.definition.label}. Error: ${error.message}`
      )
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
