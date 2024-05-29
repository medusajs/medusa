import {
  Constructor,
  InternalModuleDeclaration,
  Logger,
  MedusaContainer,
  MODULE_RESOURCE_TYPE,
  ModuleExports,
  ModuleLoaderFunction,
  ModuleResolution,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  MedusaModuleType,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { asFunction, asValue } from "awilix"
import { statSync } from "fs"
import { readdir } from "fs/promises"
import { extname, join, resolve } from "path"

type ModuleResource = {
  services: Function[]
  models: Function[]
  repositories: Function[]
  loaders: ModuleLoaderFunction[]
  moduleService: Constructor<any>
  normalizedPath: string
}

export async function loadInternalModule(
  container: MedusaContainer,
  resolution: ModuleResolution,
  logger: Logger,
  migrationOnly?: boolean,
  loaderOnly?: boolean
): Promise<{ error?: Error } | void> {
  const registrationName = !loaderOnly
    ? resolution.definition.registrationName
    : resolution.definition.registrationName + "__loaderOnly"

  const { resources } =
    resolution.moduleDeclaration as InternalModuleDeclaration

  let loadedModule: ModuleExports
  try {
    // When loading manually, we pass the exports to be loaded, meaning that we do not need to import the package to find
    // the exports. This is useful when a package export an initialize function which will bootstrap itself and therefore
    // does not need to import the package that is currently being loaded as it would create a
    // circular reference.
    const modulePath = resolution.resolutionPath as string

    if (resolution.moduleExports) {
      // TODO:
      // If we want to benefit from the auto load mechanism, even if the module exports is provided, we need to ask for the module path
      loadedModule = resolution.moduleExports
    } else {
      loadedModule = await import(modulePath)
      loadedModule = (loadedModule as any).default
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

  let moduleResources = {} as ModuleResource

  if (resolution.resolutionPath) {
    moduleResources = await loadResources(
      loadedModule?.loaders ?? [],
      resolution,
      logger
    )
  }

  if (!loadedModule?.service && !moduleResources.moduleService) {
    container.register({
      [registrationName]: asValue(undefined),
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
      [registrationName]: asValue(moduleService),
    })
    return
  }

  const localContainer = createMedusaContainer()

  const dependencies = resolution?.dependencies ?? []
  if (resources === MODULE_RESOURCE_TYPE.SHARED) {
    dependencies.push(
      ContainerRegistrationKeys.MANAGER,
      ContainerRegistrationKeys.CONFIG_MODULE,
      ContainerRegistrationKeys.LOGGER,
      ContainerRegistrationKeys.PG_CONNECTION
    )
  }

  for (const dependency of dependencies) {
    localContainer.register(
      dependency,
      asFunction(() => {
        return container.resolve(dependency, { allowUnregistered: true })
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
    registrationName,
  })

  if (error) {
    return error
  }

  const moduleService = moduleResources.moduleService ?? loadedModule.service

  container.register({
    [registrationName]: asFunction((cradle) => {
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
    const service = container.resolve(registrationName)
    await service.__hooks?.onApplicationPrepareShutdown()
    await service.__hooks?.onApplicationShutdown()
  }
}

export async function loadModuleMigrations(
  resolution: ModuleResolution,
  moduleExports?: ModuleExports
): Promise<[Function | undefined, Function | undefined]> {
  let loadedModule: ModuleExports
  try {
    loadedModule =
      moduleExports ?? (await import(resolution.resolutionPath as string))

    let runMigrations = loadedModule.runMigrations
    let revertMigration = loadedModule.revertMigration

    // Generate migration scripts if they are not present
    if (!runMigrations || !revertMigration) {
      const moduleResources = await loadResources(
        loadedModule?.loaders ?? [],
        resolution,
        console as unknown as Logger
      )

      const migrationScriptOptions = {
        moduleName: resolution.definition.key,
        models: moduleResources.models,
        pathToMigrations: moduleResources.normalizedPath + "/migrations",
      }

      runMigrations ??= ModulesSdkUtils.buildMigrationScript(
        migrationScriptOptions
      )

      revertMigration ??= ModulesSdkUtils.buildRevertMigrationScript(
        migrationScriptOptions
      )
    }

    return [runMigrations, revertMigration]
  } catch {
    return [undefined, undefined]
  }
}

async function importAllFromDir(path: string) {
  let filesToLoad: string[] = []

  const excludedExtensionsRegexp = /(\.ts\.map|\.js\.map|\.d\.ts)$/

  await readdir(path).then((files) => {
    files.forEach((file) => {
      if (
        file.startsWith("index.") ||
        excludedExtensionsRegexp.test(extname(file))
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
    await Promise.all(filesToLoad.map((filePath) => import(filePath)))
  ).flatMap((value) => {
    return Object.values(value)
  })
}

async function loadResources(
  loadedModuleLoaders: ModuleLoaderFunction[],
  moduleResolution: ModuleResolution,
  logger: Logger
): Promise<ModuleResource> {
  const modulePath = moduleResolution.resolutionPath as string
  let normalizedPath = modulePath
    .replace("index.js", "")
    .replace("index.ts", "")
  /**
   * If the project is running on ts-node all relative module resolution
   * will target the src directory and otherwise the dist directory.
   * If the path is not relative, then we can safely import from it and let the resolution
   * happen under the hood.
   */
  if (/\.\//.test(normalizedPath)) {
    const sourceDir = process[Symbol.for("ts-node.register.instance")]
      ? "src"
      : "dist"
    normalizedPath = join(process.cwd(), sourceDir, normalizedPath)
  } else {
    normalizedPath = resolve(normalizedPath)
  }

  try {
    const defaultOnFail = () => {
      return []
    }

    const [moduleService, services, models, repositories] = await Promise.all([
      import(normalizedPath).then(
        (moduleExports) => moduleExports.default.service
      ),
      importAllFromDir(resolve(normalizedPath, "services")).catch(
        defaultOnFail
      ),
      importAllFromDir(resolve(normalizedPath, "models")).catch(defaultOnFail),
      importAllFromDir(resolve(normalizedPath, "repositories")).catch(
        defaultOnFail
      ),
    ])

    const cleanupResources = (resources) => {
      return Object.values(resources).filter(
        (resource): resource is Function => {
          return typeof resource === "function"
        }
      )
    }

    const potentialServices = [...new Set(cleanupResources(services))]
    const potentialModels = [...new Set(cleanupResources(models))]
    const potentialRepositories = [...new Set(cleanupResources(repositories))]

    const finalLoaders = prepareLoaders({
      loadedModuleLoaders,
      models: potentialModels,
      repositories: potentialRepositories,
      services: potentialServices,
      moduleResolution,
      migrationPath: normalizedPath + "/migrations",
    })

    return {
      services: potentialServices,
      models: potentialModels,
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
  {
    localContainer,
    container,
    logger,
    resolution,
    loaderOnly,
    registrationName,
  }
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
      [registrationName]: asValue(undefined),
    })

    return {
      error: new Error(
        `Loaders for module ${resolution.definition.label} failed: ${err.message}`
      ),
    }
  }
}

function prepareLoaders({
  loadedModuleLoaders,
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
