import * as DefaultRepositories from "@repositories"
import {
  BaseRepository,
  ProductCategoryRepository,
  ProductCollectionRepository,
  ProductImageRepository,
  ProductOptionRepository,
  ProductOptionValueRepository,
  ProductRepository,
  ProductTagRepository,
  ProductTypeRepository,
  ProductVariantRepository,
} from "@repositories"
import { Constructor, DAL, ModulesSdkTypes } from "@medusajs/types"
import {
  ProductCategoryService,
  ProductCollectionService,
  ProductImageService,
  ProductModuleService,
  ProductOptionService,
  ProductOptionValueService,
  ProductService,
  ProductTagService,
  ProductTypeService,
  ProductVariantService,
} from "@services"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { asClass } from "awilix"
import { lowerCaseFirst } from "@medusajs/utils"

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
    productModuleService: asClass(ProductModuleService).singleton(),
    productService: asClass(ProductService).singleton(),
    productCategoryService: asClass(ProductCategoryService).singleton(),
    productVariantService: asClass(ProductVariantService).singleton(),
    productTagService: asClass(ProductTagService).singleton(),
    productCollectionService: asClass(ProductCollectionService).singleton(),
    productImageService: asClass(ProductImageService).singleton(),
    productTypeService: asClass(ProductTypeService).singleton(),
    productOptionService: asClass(ProductOptionService).singleton(),
    productOptionValueService: asClass(ProductOptionValueService).singleton(),
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
    productImageRepository: asClass(ProductImageRepository).singleton(),
    productCategoryRepository: asClass(ProductCategoryRepository).singleton(),
    productCollectionRepository: asClass(
      ProductCollectionRepository
    ).singleton(),
    productRepository: asClass(ProductRepository).singleton(),
    productTagRepository: asClass(ProductTagRepository).singleton(),
    productTypeRepository: asClass(ProductTypeRepository).singleton(),
    productOptionRepository: asClass(ProductOptionRepository).singleton(),
    productOptionValueRepository: asClass(
      ProductOptionValueRepository
    ).singleton(),
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
