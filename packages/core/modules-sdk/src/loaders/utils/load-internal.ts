import {
  Constructor,
  IModuleService,
  InternalModuleDeclaration,
  LoaderOptions,
  Logger,
  MedusaContainer,
  ModuleExports,
  ModuleLoaderFunction,
  ModuleProvider,
  ModuleProviderExports,
  ModuleProviderLoaderFunction,
  ModuleResolution,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  defineJoinerConfig,
  DmlEntity,
  dynamicImport,
  getProviderRegistrationKey,
  isString,
  MedusaModuleProviderType,
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
  loaders: ModuleLoaderFunction[] | ModuleProviderLoaderFunction[]
  moduleService: Constructor<any>
  normalizedPath: string
}

type MigrationFunction = (
  options: LoaderOptions<any>,
  moduleDeclaration?: InternalModuleDeclaration
) => Promise<void>

type ResolvedModule = ModuleExports & {
  discoveryPath: string
}

type ResolvedModuleProvider = ModuleProviderExports & {
  discoveryPath: string
}

export async function resolveModuleExports({
  resolution,
}: {
  resolution: ModuleResolution
}): Promise<ResolvedModule | ResolvedModuleProvider | { error: any }> {
  let resolvedModuleExports: ModuleExports
  try {
    if (resolution.moduleExports) {
      // TODO:
      // If we want to benefit from the auto load mechanism, even if the module exports is provided, we need to ask for the module path
      resolvedModuleExports = resolution.moduleExports as ModuleExports
      resolvedModuleExports.discoveryPath = resolution.resolutionPath as string
    } else {
      const module = await dynamicImport(resolution.resolutionPath as string)

      if ("discoveryPath" in module) {
        const reExportedLoadedModule = await dynamicImport(module.discoveryPath)
        const discoveryPath = module.discoveryPath
        resolvedModuleExports =
          reExportedLoadedModule.default ?? reExportedLoadedModule
        resolvedModuleExports.discoveryPath = discoveryPath as string
      } else {
        resolvedModuleExports =
          (module as { default: ModuleExports }).default ?? module
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

async function loadInternalProvider(
  args: {
    container: MedusaContainer
    resolution: ModuleResolution
    logger: Logger
    migrationOnly?: boolean
    loaderOnly?: boolean
  },
  providers: ModuleProvider[]
): Promise<{ error?: Error } | void> {
  const { container, resolution, logger, migrationOnly } = args

  const errors: { error?: Error }[] = []
  for (const provider of providers) {
    const providerRes = provider.resolve as ModuleProviderExports

    const canLoadProvider =
      providerRes && (isString(providerRes) || !providerRes?.services)

    if (!canLoadProvider) {
      continue
    }

    const res = await loadInternalModule({
      container,
      resolution: {
        ...resolution,
        moduleExports: !isString(providerRes) ? providerRes : undefined,
        definition: {
          ...resolution.definition,
          key: provider.id!,
        },
        resolutionPath: isString(provider.resolve)
          ? require.resolve(provider.resolve, {
              paths: [process.cwd()],
            })
          : false,
      },
      logger,
      migrationOnly,
      loadingProviders: true,
    })

    if (res) {
      errors.push(res)
    }
  }

  const errorMessages = errors.map((e) => e.error?.message).join("\n")
  return errors.length
    ? {
        error: {
          name: "ModuleProviderError",
          message: `Errors while loading module providers for module ${resolution.definition.key}:\n${errorMessages}`,
          stack: errors.map((e) => e.error?.stack).join("\n"),
        },
      }
    : undefined
}

export async function loadInternalModule(args: {
  container: MedusaContainer
  resolution: ModuleResolution
  logger: Logger
  migrationOnly?: boolean
  loaderOnly?: boolean
  loadingProviders?: boolean
}): Promise<{ error?: Error } | void> {
  const {
    container,
    resolution,
    logger,
    migrationOnly,
    loaderOnly,
    loadingProviders,
  } = args

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

  const loadedModule_ = loadedModule as ModuleExports
  if (
    !loadingProviders &&
    !loadedModule_?.service &&
    !moduleResources.moduleService
  ) {
    container.register({
      [keyName]: asValue(undefined),
    })

    return {
      error: new Error(
        `No service found in module ${resolution?.definition?.label}. Make sure your module exports a service.`
      ),
    }
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

  // if module has providers, load them
  let providerOptions: any = undefined
  if (!loadingProviders) {
    const providers = (resolution?.options?.providers as any[]) ?? []

    const res = await loadInternalProvider(
      {
        ...args,
        container: localContainer,
      },
      providers
    )

    if (res?.error) {
      return res
    }
  } else {
    providerOptions = (resolution?.options?.providers as any[]).find(
      (p) => p.id === resolution.definition.key
    )?.options
  }

  if (migrationOnly && !loadingProviders) {
    const moduleService_ =
      moduleResources.moduleService ?? loadedModule_.service

    // Partially loaded module, only register the service __joinerConfig function to be able to resolve it later
    const moduleService = {
      __joinerConfig: moduleService_.prototype.__joinerConfig,
    }

    container.register({
      [keyName]: asValue(moduleService),
    })

    return
  }

  const loaders = moduleResources.loaders ?? loadedModule?.loaders ?? []
  const error = await runLoaders(loaders, {
    container,
    localContainer,
    logger,
    resolution,
    loaderOnly,
    keyName,
    providerOptions,
  })

  if (error) {
    return error
  }

  if (loadingProviders) {
    const loadedProvider_ = loadedModule as ModuleProviderExports

    let moduleProviderServices = moduleResources.moduleService
      ? [moduleResources.moduleService]
      : loadedProvider_.services ?? loadedProvider_

    if (!moduleProviderServices) {
      return
    }

    for (const moduleProviderService of moduleProviderServices) {
      const modProvider_ = moduleProviderService as any

      const originalIdentifier = modProvider_.identifier as string
      const providerId = keyName

      if (!originalIdentifier) {
        const providerResolutionName =
          modProvider_.DISPLAY_NAME ?? resolution.resolutionPath

        throw new Error(
          `Module provider ${providerResolutionName} does not have a static "identifier" property on its service class.`
        )
      }

      const alreadyRegisteredProvider = container.hasRegistration(
        getProviderRegistrationKey({
          providerId,
          providerIdentifier: originalIdentifier,
        })
      )
      if (alreadyRegisteredProvider) {
        throw new Error(
          `Module provider ${originalIdentifier} has already been registered. Please provide a different "id" in the provider options.`
        )
      }

      modProvider_.__type = MedusaModuleProviderType

      const registrationKey = getProviderRegistrationKey({
        providerId,
        providerIdentifier: originalIdentifier,
      })

      container.register({
        [registrationKey]: asFunction(() => {
          ;(moduleProviderService as any).__type = MedusaModuleType
          return new moduleProviderService(
            localContainer.cradle,
            resolution.options,
            resolution.moduleDeclaration
          )
        }).singleton(),
      })
    }
  } else {
    const moduleService = moduleResources.moduleService ?? loadedModule_.service
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
  }

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
  const runMigrationsFn: ((...args) => Promise<any>)[] = []
  const revertMigrationFn: ((...args) => Promise<any>)[] = []
  const generateMigrationFn: ((...args) => Promise<any>)[] = []

  try {
    const mainLoadedModule = await resolveModuleExports({
      resolution: { ...resolution, moduleExports },
    })
    if ("error" in mainLoadedModule) {
      throw mainLoadedModule.error
    }

    const loadedServices = [mainLoadedModule] as (
      | ResolvedModule
      | ResolvedModuleProvider
    )[]

    if (Array.isArray(resolution?.options?.providers)) {
      for (const provider of (resolution.options as any).providers) {
        const providerRes = provider.resolve as ModuleProviderExports

        const canLoadProvider =
          providerRes && (isString(providerRes) || !providerRes?.services)

        if (!canLoadProvider) {
          continue
        }

        const loadedProvider = await resolveModuleExports({
          resolution: {
            ...resolution,
            moduleExports: !isString(providerRes) ? providerRes : undefined,
            definition: {
              ...resolution.definition,
              key: provider.id,
            },
            resolutionPath: isString(provider.resolve)
              ? require.resolve(provider.resolve, { paths: [process.cwd()] })
              : false,
          },
        })

        if ("error" in loadedProvider) {
          throw loadedProvider.error
        }

        loadedServices.push(loadedProvider as ResolvedModuleProvider)
      }
    }

    const migrationScripts: any[] = []
    for (const loadedModule of loadedServices) {
      let runMigrationsCustom = loadedModule.runMigrations
      let revertMigrationCustom = loadedModule.revertMigration
      let generateMigrationCustom = loadedModule.generateMigration

      runMigrationsCustom && runMigrationsFn.push(runMigrationsCustom)
      revertMigrationCustom && revertMigrationFn.push(revertMigrationCustom)
      generateMigrationCustom &&
        generateMigrationFn.push(generateMigrationCustom)

      if (!runMigrationsCustom || !revertMigrationCustom) {
        const moduleResources = await loadResources({
          moduleResolution: resolution,
          discoveryPath: loadedModule.discoveryPath,
          loadedModuleLoaders: loadedModule?.loaders,
        })

        migrationScripts.push({
          moduleName: resolution.definition.key,
          models: moduleResources.models,
          pathToMigrations: join(moduleResources.normalizedPath, "migrations"),
        })
      }

      for (const migrationScriptOptions of migrationScripts) {
        const migrationUp =
          runMigrationsCustom ??
          ModulesSdkUtils.buildMigrationScript(migrationScriptOptions)
        runMigrationsFn.push(migrationUp)

        const migrationDown =
          revertMigrationCustom ??
          ModulesSdkUtils.buildRevertMigrationScript(migrationScriptOptions)
        revertMigrationFn.push(migrationDown)

        const genMigration =
          generateMigrationCustom ??
          ModulesSdkUtils.buildGenerateMigrationScript(migrationScriptOptions)
        generateMigrationFn.push(genMigration)
      }
    }

    const runMigrations = async (...args) => {
      for (const migration of runMigrationsFn.filter(Boolean)) {
        await migration.apply(migration, args)
      }
    }
    const revertMigration = async (...args) => {
      for (const migration of revertMigrationFn.filter(Boolean)) {
        await migration.apply(migration, args)
      }
    }
    const generateMigration = async (...args) => {
      for (const migration of generateMigrationFn.filter(Boolean)) {
        await migration.apply(migration, args)
      }
    }

    return {
      runMigrations,
      revertMigration,
      generateMigration,
    }
  } catch (e) {
    throw new Error(
      `Unable to resolve the migration scripts for the module ${resolution.definition.key}\n${e.message}\n${e.stack}`
    )
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
  loadedModuleLoaders?: ModuleLoaderFunction[] | ModuleProviderLoaderFunction[]
}): Promise<ModuleResource> {
  logger ??= console as unknown as Logger
  loadedModuleLoaders ??= []

  const modulePath = discoveryPath
  let normalizedPath = dirname(
    require.resolve(modulePath, { paths: [process.cwd()] })
  )
  normalizedPath = resolve(normalizedPath)

  try {
    const defaultOnFail = () => {
      return []
    }

    const [moduleService, services, models, repositories] = await Promise.all([
      dynamicImport(modulePath).then((moduleExports) => {
        const mod = moduleExports.default ?? moduleExports
        return mod.service
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

    // if a module service is provided, we generate a joiner config
    if (moduleService) {
      generateJoinerConfigIfNecessary({
        moduleResolution,
        service: moduleService,
        models: potentialModels,
      })
    }

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
  {
    localContainer,
    container,
    logger,
    resolution,
    loaderOnly,
    keyName,
    providerOptions,
  }
): Promise<void | { error: Error }> {
  try {
    for (const loader of loaders) {
      await loader(
        {
          container: localContainer,
          logger,
          options: providerOptions ?? resolution.options,
          dataLoaderOnly: loaderOnly,
          moduleOptions: providerOptions ? resolution.options : undefined,
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
  loadedModuleLoaders = [] as
    | ModuleLoaderFunction[]
    | ModuleProviderLoaderFunction[],
  models,
  repositories,
  services,
  moduleResolution,
  migrationPath,
}) {
  const finalLoaders: (ModuleLoaderFunction | ModuleProviderLoaderFunction)[] =
    []

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
