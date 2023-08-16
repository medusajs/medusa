import * as DefaultRepositories from "../repositories"

import { Constructor, DAL, ModulesSdkTypes } from "@medusajs/types"
import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"

import { BaseRepository } from "../repositories"
import { StockLocationService } from "../services"
import { asClass } from "awilix"
import { lowerCaseFirst } from "@medusajs/utils"

export default async (
  { container, options }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  const customRepositories = (
    options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  )?.repositories

  container.register({
    stockLocationService: asClass(StockLocationService).singleton(),
  })

  if (customRepositories) {
    await loadCustomRepositories({ customRepositories, container })
  } else {
    await loadDefaultRepositories({ container })
  }
}

async function loadDefaultRepositories({ container }) {
  container.register({
    baseRepository: asClass(BaseRepository).singleton(),
    stockLocationRepository: asClass(
      DefaultRepositories.StockLocationRepostiory
    ).singleton(),
    stockLocationAddressRepository: asClass(
      DefaultRepositories.StockLocationAddressRepository
    ).singleton(),
  })
}

/**
 * Load the repositories from the custom repositories object. If a repository is not
 * present in the custom repositories object, the default repository will be used.
 *
 * @param customRepositories
 * @param container
 */
async function loadCustomRepositories({ customRepositories, container }) {
  const customRepositoriesMap = new Map(Object.entries(customRepositories))

  Object.entries(DefaultRepositories).forEach(([key, DefaultRepository]) => {
    let finalRepository = customRepositoriesMap.get(key)

    if (
      !finalRepository ||
      !(finalRepository as Constructor<DAL.RepositoryService>).prototype.find
    ) {
      finalRepository = DefaultRepository
    }

    container.register({
      [lowerCaseFirst(key)]: asClass(
        finalRepository as Constructor<DAL.RepositoryService>
      ).singleton(),
    })
  })
}
