import {
  Constructor,
  LoaderOptions,
  MedusaContainer,
  ModuleServiceInitializeCustomDataLayerOptions,
  ModuleServiceInitializeOptions,
  RepositoryService,
} from "@medusajs/types"

import { asClass } from "awilix"
import { internalModuleServiceFactory } from "../internal-module-service-factory"
import { lowerCaseFirst } from "../../common"
import { mikroOrmBaseRepositoryFactory } from "../../dal"

type RepositoryLoaderOptions = {
  moduleModels: Record<string, any>
  moduleRepositories?: Record<string, any>
  customRepositories: Record<string, any>
  container: MedusaContainer
}

type ServiceLoaderOptions = {
  moduleModels: Record<string, any>
  moduleServices: Record<string, any>
  container: MedusaContainer
}

/**
 * Factory for creating a container loader for a module.
 *
 * @param moduleModels
 * @param moduleServices
 * @param moduleRepositories
 * @param customRepositoryLoader The default repository loader is based on mikro orm. If you want to use a custom repository loader, you can pass it here.
 */
export function moduleContainerLoaderFactory({
  moduleModels,
  moduleServices,
  moduleRepositories = {},
  customRepositoryLoader = loadModuleRepositories,
}: {
  moduleModels: Record<string, any>
  moduleServices: Record<string, any>
  moduleRepositories?: Record<string, any>
  customRepositoryLoader?: (options: RepositoryLoaderOptions) => void
}): ({ container, options }: LoaderOptions) => Promise<void> {
  return async ({
    container,
    options,
  }: LoaderOptions<
    | ModuleServiceInitializeOptions
    | ModuleServiceInitializeCustomDataLayerOptions
  >) => {
    const customRepositories = (
      options as ModuleServiceInitializeCustomDataLayerOptions
    )?.repositories

    loadModuleServices({
      moduleModels,
      moduleServices,
      container,
    })

    const repositoryLoader = customRepositoryLoader ?? loadModuleRepositories
    repositoryLoader({
      moduleModels,
      moduleRepositories,
      customRepositories: customRepositories ?? {},
      container,
    })
  }
}

/**
 * Load the services from the module services object. If a service is not
 * present a default service will be created for the model.
 *
 * @param moduleModels
 * @param moduleServices
 * @param container
 */
export function loadModuleServices({
  moduleModels,
  moduleServices,
  container,
}: ServiceLoaderOptions) {
  const moduleServicesMap = new Map(
    Object.entries(moduleServices).map(([key, repository]) => [
      lowerCaseFirst(key),
      repository,
    ])
  )

  // Build default services for all models that are not present in the module services
  Object.values(moduleModels).forEach((Model) => {
    const mappedServiceName = lowerCaseFirst(Model.name) + "Service"
    const finalService = moduleServicesMap.get(mappedServiceName)

    if (!finalService) {
      moduleServicesMap.set(
        mappedServiceName,
        internalModuleServiceFactory(Model)
      )
    }
  })

  const allServices = [...moduleServicesMap]

  allServices.forEach(([key, service]) => {
    container.register({
      [lowerCaseFirst(key)]: asClass(service as Constructor<any>).singleton(),
    })
  })
}

/**
 * Load the repositories from the custom repositories object. If a repository is not
 * present in the custom repositories object, the default repository will be used from the module repository.
 * If none are present, a default repository will be created for the model.
 *
 * @param moduleModels
 * @param moduleRepositories
 * @param customRepositories
 * @param container
 */
export function loadModuleRepositories({
  moduleModels,
  moduleRepositories = {},
  customRepositories,
  container,
}: RepositoryLoaderOptions) {
  const customRepositoriesMap = new Map(
    Object.entries(customRepositories).map(([key, repository]) => [
      lowerCaseFirst(key),
      repository,
    ])
  )
  const moduleRepositoriesMap = new Map(
    Object.entries(moduleRepositories).map(([key, repository]) => [
      lowerCaseFirst(key),
      repository,
    ])
  )

  // Build default repositories for all models that are not present in the custom repositories or module repositories
  Object.values(moduleModels).forEach((Model) => {
    const mappedRepositoryName = lowerCaseFirst(Model.name) + "Repository"
    let finalRepository = customRepositoriesMap.get(mappedRepositoryName)
    finalRepository ??= moduleRepositoriesMap.get(mappedRepositoryName)

    if (!finalRepository) {
      moduleRepositoriesMap.set(
        mappedRepositoryName,
        mikroOrmBaseRepositoryFactory(Model)
      )
    }
  })

  const allRepositories = [...customRepositoriesMap, ...moduleRepositoriesMap]

  allRepositories.forEach(([key, repository]) => {
    let finalRepository = customRepositoriesMap.get(key)

    if (!finalRepository) {
      finalRepository = repository
    }

    container.register({
      [lowerCaseFirst(key)]: asClass(
        finalRepository as Constructor<RepositoryService>
      ).singleton(),
    })
  })
}
