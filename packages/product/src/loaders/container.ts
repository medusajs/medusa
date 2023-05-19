import { asClass, asValue } from "awilix"
import {
  ProductService,
  ProductTagService,
  ProductVariantService,
} from "@services"
import * as DefaultRepositories from "@repositories"
import {
  ProductCollectionRepository,
  ProductRepository,
  ProductTagRepository,
  ProductVariantRepository,
} from "@repositories"
import {
  ProductServiceInitializeCustomDataLayerOptions,
  RepositoryService,
} from "../types"
import { Constructor } from "@medusajs/types"
import { lowerCaseFirst } from "../utils"

export default async ({ container, options }): Promise<void> => {
  if (options.injectedDependencies) {
    for (const service in options.injectedDependencies) {
      container.register(
        service,
        asValue(options.injectedDependencies[service])
      )
    }
  }

  const customRepositories = (
    options as ProductServiceInitializeCustomDataLayerOptions
  )?.repositories

  container.register({
    productService: asClass(ProductService).singleton(),
    productVariantService: asClass(ProductVariantService).singleton(),
    productTagService: asClass(ProductTagService).singleton(),
  })

  if (customRepositories) {
    await loadCustomRepositories({ customRepositories, container })
  } else {
    await loadDefaultRepositories({ container })
  }
}

function loadDefaultRepositories({ container }) {
  container.register({
    productRepository: asClass(ProductRepository).singleton(),
    productVariantRepository: asClass(ProductVariantRepository).singleton(),
    productTagRepository: asClass(ProductTagRepository).singleton(),
    productCollectionRepository: asClass(
      ProductCollectionRepository
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
function loadCustomRepositories({ customRepositories, container }) {
  const customRepositoriesMap = new Map(Object.entries(customRepositories))

  Object.entries(DefaultRepositories).forEach(([key, DefaultRepository]) => {
    let finalRepository = customRepositoriesMap.get(key)

    if (
      !finalRepository ||
      !(finalRepository as Constructor<RepositoryService>).prototype.find
    ) {
      finalRepository = DefaultRepository
    }

    container.register({
      [lowerCaseFirst(key)]: asClass(
        finalRepository as Constructor<RepositoryService>
      ).singleton(),
    })
  })
}
