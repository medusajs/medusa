import { LoaderOptions } from "@medusajs/modules-sdk"

import { asClass } from "awilix"
import {
  ProductCategoryService,
  ProductModuleService,
  ProductService,
  ProductTagService,
  ProductVariantService,
  ProductCollectionService,
} from "@services"
import * as DefaultRepositories from "@repositories"
import {
  ProductCategoryRepository,
  ProductCollectionRepository,
  ProductRepository,
  ProductTagRepository,
  ProductVariantRepository,
} from "@repositories"
import {
  ProductServiceInitializeCustomDataLayerOptions,
  ProductServiceInitializeOptions,
} from "../types"
import { Constructor, DAL } from "@medusajs/types"
import { lowerCaseFirst } from "@medusajs/utils"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ProductServiceInitializeOptions
  | ProductServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  const customRepositories = (
    options as ProductServiceInitializeCustomDataLayerOptions
  )?.repositories

  container.register({
    productModuleService: asClass(ProductModuleService).singleton(),
    productService: asClass(ProductService).singleton(),
    productCategoryService: asClass(ProductCategoryService).singleton(),
    productVariantService: asClass(ProductVariantService).singleton(),
    productTagService: asClass(ProductTagService).singleton(),
    productCollectionService: asClass(ProductCollectionService).singleton(),
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
    productCategoryRepository: asClass(ProductCategoryRepository).singleton(),
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
