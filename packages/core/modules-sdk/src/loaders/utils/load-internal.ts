import {
  Constructor,
  IModuleService,
  InternalModuleDeclaration,
  LoaderOptions,
  Logger,
  MedusaContainer,
  ModuleExports,
  ModuleLoaderFunction,
  ModuleResolution,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  defineJoinerConfig,
  DmlEntity,
  dynamicImport,
  MedusaModuleType,
  ModulesSdkUtils,
  toMikroOrmEntities,
} from "@medusajs/utils"
import { asFunction, asValue } from "awilix"
import { statSync } from "fs"
import { readdir } from "fs/promises"
import { dirname, join, resolve } from "path"

type ModuleResource = {
  services: Function[]
  models: Function[]
  repositories: Function[]
  loaders: ModuleLoaderFunction[]
  moduleService: Constructor<any>
  normalizedPath: string
}

type MigrationFunction = (
  options: LoaderOptions<any>,
  moduleDeclaration?: InternalModuleDeclaration
) => Promise<void>

export async function resolveModuleExports({
  resolution,
}: {
  resolution: ModuleResolution
}): Promise<
  | (ModuleExports & {
      discoveryPath: string
    })
  | { error: any }
> {
  let resolvedModuleExports: ModuleExports
  try {
    if (resolution.moduleExports) {
      // TODO:
      // If we want to benefit from the auto load mechanism, even if the module exports is provided, we need to ask for the module path
      resolvedModuleExports = resolution.moduleExports
      resolvedModuleExports.discoveryPath = resolution.resolutionPath as string
    } else {
      const module = await dynamicImport(resolution.resolutionPath as string)

      if ("discoveryPath" in module) {
        const reExportedLoadedModule = await dynamicImport(module.discoveryPath)
        const discoveryPath = module.discoveryPath
        resolvedModuleExports = reExportedLoadedModule.default
        resolvedModuleExports.discoveryPath = discoveryPath as string
      } else {
        resolvedModuleExports = (module as { default: ModuleExports }).default
        resolvedModuleExports.discoveryPath =
          resolution.resolutionPath as string
      }
    }

    return resolvedModuleExports as ModuleExports & {
      discoveryPath: string
    }
  } catch (error) {
    if (
      resolution.definition.isRequired &&
      resolution.definition.defaultPackage
    ) {
      return {
        error: new Error(
          `Make sure you have installed the default package: ${resolution.definition.defaultPackage}`
        ),
      }
    }

    return { error }
  }
}

export async function loadInternalModule(
  container: MedusaContainer,
  resolution: ModuleResolution,
  logger: Logger,
  migrationOnly?: boolean,
  loaderOnly?: boolean
): Promise<{ error?: Error } | void> {
  const keyName = !loaderOnly
    ? resolution.definition.key
    : resolution.definition.key + "__loaderOnly"

  const loadedModule = await resolveModuleExports({ resolution })

  if ("error" in loadedModule) {
    return loadedModule
  }

  let moduleResources = {} as ModuleResource

  if (loadedModule.discoveryPath) {
    moduleResources = await loadResources({
      moduleResolution: resolution,
      discoveryPath: loadedModule.discoveryPath,
      logger,
      loadedModuleLoaders: loadedModule?.loaders,
    })
  }

  if (!loadedModule?.service && !moduleResources.moduleService) {
    container.register({
      [keyName]: asValue(undefined),
    })

    return {
      error: new Error(
        `No service found in module ${resolution?.definition?.label}. Make sure your module exports a service.`
      ),
    }
  }

  if (migrationOnly) {
    const moduleService_ = moduleResources.moduleService ?? loadedModule.service

    // Partially loaded module, only register the service __joinerConfig function to be able to resolve it later
    const moduleService = {
      __joinerConfig: moduleService_.prototype.__joinerConfig,
    }

    container.register({
      [keyName]: asValue(moduleService),
    })
    return
  }

  const localContainer = createMedusaContainer()

  const dependencies = resolution?.dependencies ?? []

  dependencies.push(
    ContainerRegistrationKeys.MANAGER,
    ContainerRegistrationKeys.CONFIG_MODULE,
    ContainerRegistrationKeys.LOGGER,
    ContainerRegistrationKeys.PG_CONNECTION
  )

  for (const dependency of dependencies) {
    localContainer.register(
      dependency,
      asFunction(() => {
        return container.resolve(dependency, { allowUnregistered: true })
      })
    )
  }

  if (resolution.definition.__passSharedContainer) {
    localContainer.register(
      "sharedContainer",
      asFunction(() => {
        return container
      })
    )
  }

  const loaders = moduleResources.loaders ?? loadedModule?.loaders ?? []
  const error = await runLoaders(loaders, {
    container,
    localContainer,
    logger,
    resolution,
    loaderOnly,
    keyName,
  })

  if (error) {
    return error
  }

  const moduleService = moduleResources.moduleService ?? loadedModule.service

  container.register({
    [keyName]: asFunction((cradle) => {
      ;(moduleService as any).__type = MedusaModuleType
      return new moduleService(
        localContainer.cradle,
        resolution.options,
        resolution.moduleDeclaration
      )
    }).singleton(),
  })

  if (loaderOnly) {
    // The expectation is only to run the loader as standalone, so we do not need to register the service and we need to cleanup all services
    const service = container.resolve<IModuleService>(keyName)
    await service.__hooks?.onApplicationPrepareShutdown?.()
    await service.__hooks?.onApplicationShutdown?.()
  }
}

export async function loadModuleMigrations(
  resolution: ModuleResolution,
  moduleExports?: ModuleExports
): Promise<{
  runMigrations?: MigrationFunction
  revertMigration?: MigrationFunction
  generateMigration?: MigrationFunction
}> {
  const loadedModule = await resolveModuleExports({
    resolution: { ...resolution, moduleExports },
  })

  if ("error" in loadedModule) {
    throw loadedModule.error
  }

  try {
    let runMigrations = loadedModule.runMigrations
    let revertMigration = loadedModule.revertMigration
    let generateMigration = loadedModule.generateMigration

    if (!runMigrations || !revertMigration) {
      const moduleResources = await loadResources({
        moduleResolution: resolution,
        discoveryPath: loadedModule.discoveryPath,
        loadedModuleLoaders: loadedModule?.loaders,
      })

      const migrationScriptOptions = {
        moduleName: resolution.definition.key,
        models: moduleResources.models,
        pathToMigrations: join(moduleResources.normalizedPath, "migrations"),
      }

      runMigrations ??= ModulesSdkUtils.buildMigrationScript(
        migrationScriptOptions
      )

      revertMigration ??= ModulesSdkUtils.buildRevertMigrationScript(
        migrationScriptOptions
      )

      generateMigration ??= ModulesSdkUtils.buildGenerateMigrationScript(
        migrationScriptOptions
      )
    }

    return { runMigrations, revertMigration, generateMigration }
  } catch {
    return {}
  }
}

async function importAllFromDir(path: string) {
  let filesToLoad: string[] = []

  const excludedExtensions = [".ts.map", ".js.map", ".d.ts"]

  await readdir(path).then((files) => {
    files.forEach((file) => {
      if (
        file.startsWith("index.") ||
        excludedExtensions.some((ext) => file.endsWith(ext))
      ) {
        return
      }

      const filePath = join(path, file)
      const stats = statSync(filePath)

      if (stats.isDirectory()) {
        // TODO: should we handle that? dont think so but I put that here for discussion
      } else if (stats.isFile()) {
        filesToLoad.push(filePath)
      }
    })

    return filesToLoad
  })

  return (
    await Promise.all(filesToLoad.map((filePath) => dynamicImport(filePath)))
  ).flatMap((value) => {
    return Object.values(value)
  })
}

export async function loadResources({
  moduleResolution,
  discoveryPath,
  logger,
  loadedModuleLoaders,
}: {
  moduleResolution: ModuleResolution
  discoveryPath: string
  logger?: Logger
  loadedModuleLoaders?: ModuleLoaderFunction[]
}): Promise<ModuleResource> {
  logger ??= console as unknown as Logger
  loadedModuleLoaders ??= []

  const modulePath = discoveryPath
  let normalizedPath = dirname(require.resolve(modulePath))
  normalizedPath = resolve(normalizedPath)

  try {
    const defaultOnFail = () => {
      return []
    }

    const [moduleService, services, models, repositories] = await Promise.all([
      dynamicImport(modulePath).then((moduleExports) => {
        return moduleExports.default.service
      }),
      importAllFromDir(resolve(normalizedPath, "services")).catch(
        defaultOnFail
      ),
      importAllFromDir(resolve(normalizedPath, "models")).catch(defaultOnFail),
      importAllFromDir(resolve(normalizedPath, "repositories")).catch(
        defaultOnFail
      ),
    ])

    const cleanupResources = (resources) => {
      return Object.values(resources)
        .map((resource) => {
          if (DmlEntity.isDmlEntity(resource)) {
            return resource
          }

          if (typeof resource === "function") {
            return resource
          }

          return null
        })
        .filter((v): v is Function => !!v)
    }

    const potentialServices = [...new Set(cleanupResources(services))]
    const potentialModels = [...new Set(cleanupResources(models))]
    const mikroOrmModels = toMikroOrmEntities(potentialModels)
    const potentialRepositories = [...new Set(cleanupResources(repositories))]

    const finalLoaders = prepareLoaders({
      loadedModuleLoaders,
      models: mikroOrmModels,
      repositories: potentialRepositories,
      services: potentialServices,
      moduleResolution,
      migrationPath: normalizedPath + "/migrations",
    })

    generateJoinerConfigIfNecessary({
      moduleResolution,
      service: moduleService,
      models: potentialModels,
    })

    return {
      services: potentialServices,
      models: mikroOrmModels,
      repositories: potentialRepositories,
      loaders: finalLoaders,
      moduleService,
      normalizedPath,
    }
  } catch (e) {
    logger.warn(
      `Unable to load resources for module ${modulePath} automagically. ${e.message}`
    )

    return {} as ModuleResource
  }
}

async function runLoaders(
  loaders: Function[] = [],
  { localContainer, container, logger, resolution, loaderOnly, keyName }
): Promise<void | { error: Error }> {
  try {
    for (const loader of loaders) {
      await loader(
        {
          container: localContainer,
          logger,
          options: resolution.options,
          dataLoaderOnly: loaderOnly,
        },
        resolution.moduleDeclaration as InternalModuleDeclaration
      )
    }
  } catch (err) {
    container.register({
      [keyName]: asValue(undefined),
    })

    return {
      error: new Error(
        `Loaders for module ${resolution.definition.label} failed: ${err.message}`
      ),
    }
  }
}

function prepareLoaders({
  loadedModuleLoaders = [] as ModuleLoaderFunction[],
  models,
  repositories,
  services,
  moduleResolution,
  migrationPath,
}) {
  const finalLoaders: ModuleLoaderFunction[] = []

  const toObjectReducer = (acc, curr) => {
    acc[curr.name] = curr
    return acc
  }

  /*
   * If no connectionLoader function is provided, create a default connection loader.
   * TODO: Validate naming convention
   */
  const connectionLoaderName = "connectionLoader"
  const containerLoader = "containerLoader"

  const hasConnectionLoader = loadedModuleLoaders.some(
    (l) => l.name === connectionLoaderName
  )

  if (!hasConnectionLoader && models.length > 0) {
    const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
      moduleName: moduleResolution.definition.key,
      moduleModels: models,
      migrationsPath: migrationPath,
    })
    finalLoaders.push(connectionLoader)
  }

  const hasContainerLoader = loadedModuleLoaders.some(
    (l) => l.name === containerLoader
  )

  if (!hasContainerLoader) {
    const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
      moduleModels: models.reduce(toObjectReducer, {}),
      moduleRepositories: repositories.reduce(toObjectReducer, {}),
      moduleServices: services.reduce(toObjectReducer, {}),
    })
    finalLoaders.push(containerLoader)
  }

  finalLoaders.push(
    ...loadedModuleLoaders.filter((loader) => {
      if (
        loader.name !== connectionLoaderName &&
        loader.name !== containerLoader
      ) {
        return true
      }

      return (
        (loader.name === containerLoader && hasContainerLoader) ||
        (loader.name === connectionLoaderName && hasConnectionLoader)
      )
    })
  )

  return finalLoaders
}

function generateJoinerConfigIfNecessary({
  moduleResolution,
  service,
  models,
}: {
  moduleResolution: ModuleResolution
  service: Constructor<IModuleService>
  models: (Function | DmlEntity<any, any>)[]
}) {
  const originalJoinerConfigFn = service.prototype.__joinerConfig

  service.prototype.__joinerConfig = function () {
    if (originalJoinerConfigFn) {
      return {
        serviceName: moduleResolution.definition.key,
        ...originalJoinerConfigFn(),
      }
    }

    return defineJoinerConfig(moduleResolution.definition.key, {
      models,
    })
  }
}
