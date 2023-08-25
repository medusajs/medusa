import { Constructor, DAL, ModulesSdkTypes } from "@medusajs/types"
import * as DefaultRepositories from "@repositories"
import { BaseRepository, CurrencyRepository } from "@repositories"
import { CurrencyService } from "@services"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { lowerCaseFirst } from "@medusajs/utils"
import { asClass } from "awilix"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  const customRepositories = (
    options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  )?.repositories

  container.register({
    currencyService: asClass(CurrencyService).singleton(),
  })

  if (customRepositories) {
    loadCustomRepositories({ customRepositories, container })
  } else {
    loadDefaultRepositories({ container })
  }
}

function loadDefaultRepositories({ container }) {
  container.register({
    baseRepository: asClass(BaseRepository).singleton(),
    currencyRepository: asClass(CurrencyRepository).singleton(),
  })
}

/**
 * Load the repositories from the custom repositories object. If a repository is not
 * present in the custom repositories object, the default repository will be used.
 *
 * @param customRepositories
 * @param container
 */
function loadCustomRepositories({ customRepositories, container }) {
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
