import { LoaderOptions } from "@medusajs/modules-sdk"

import { asClass } from "awilix"
import {
  ProductCategoryService,
  ProductCollectionService,
  ProductModuleService,
  ProductService,
  ProductTagService,
  ProductVariantService,
} from "@services"
import * as DefaultRepositories from "@repositories"
import {
  ProductCategoryRepository,
  ProductCollectionRepository,
  ProductImageRepository,
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
import { BaseRepository } from "../repositories/base"
import ProductImageService from "../services/product-image"

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
    productImageService: asClass(ProductImageService).singleton(),
  })

  if (customRepositories) {
    await loadCustomRepositories({ customRepositories, container })
  } else {
    await loadDefaultRepositories({ container })
  }
}

function loadDefaultRepositories({ container }) {
  container.register({
    baseRepository: asClass(BaseRepository).singleton(),
    productImageRepository: asClass(ProductImageRepository).singleton(),
    productCategoryRepository: asClass(ProductCategoryRepository).singleton(),
    productCollectionRepository: asClass(
      ProductCollectionRepository
    ).singleton(),
    productRepository: asClass(ProductRepository).singleton(),
    productTagRepository: asClass(ProductTagRepository).singleton(),
    productVariantRepository: asClass(ProductVariantRepository).singleton(),
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
