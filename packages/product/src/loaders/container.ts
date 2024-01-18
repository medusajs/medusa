import * as DefaultRepositories from "@repositories"
import {
  BaseRepository,
  ProductCategoryRepository,
  ProductImageRepository,
  ProductRepository,
} from "@repositories"
import {
  Constructor,
  CreateProductTagDTO,
  CreateProductTypeDTO,
  DAL,
  ModulesSdkTypes,
  ProductTypes,
  UpdateProductTagDTO,
  UpdateProductTypeDTO,
  WithRequiredProperty,
} from "@medusajs/types"
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
import { DALUtils, lowerCaseFirst } from "@medusajs/utils"
import {
  ProductCollection,
  ProductOption,
  ProductOptionValue,
  ProductTag,
  ProductType,
  ProductVariant,
} from "@models"
import {
  ProductCollectionServiceTypes,
  ProductOptionValueServiceTypes,
  ProductVariantServiceTypes,
} from "@types"
import { RequiredEntityData } from "@mikro-orm/core"

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

  const defaultProductCollectionRepository =
    DALUtils.mikroOrmBaseRepositoryFactory<
      ProductCollection,
      {
        create: ProductCollectionServiceTypes.CreateProductCollection
        update: ProductCollectionServiceTypes.UpdateProductCollection
      }
    >(ProductCollection)
  const defaultProductOptionRepository = DALUtils.mikroOrmBaseRepositoryFactory<
    ProductOption,
    {
      create: ProductTypes.CreateProductOptionDTO
      update: ProductTypes.UpdateProductOptionDTO
    }
  >(ProductOption)
  const defaultProductOptionValueRepository =
    DALUtils.mikroOrmBaseRepositoryFactory<
      ProductOptionValue,
      {
        create: ProductOptionValueServiceTypes.CreateProductOptionValueDTO
        update: ProductOptionValueServiceTypes.UpdateProductOptionValueDTO
      }
    >(ProductOptionValue)
  const defaultProductTagRepository = DALUtils.mikroOrmBaseRepositoryFactory<
    ProductTag,
    {
      create: CreateProductTagDTO
      update: UpdateProductTagDTO
    }
  >(ProductTag)
  const defaultProductTypeRepository = DALUtils.mikroOrmBaseRepositoryFactory<
    ProductType,
    {
      create: CreateProductTypeDTO
      update: UpdateProductTypeDTO
    }
  >(ProductType)
  const defaultProductVariantRepository =
    DALUtils.mikroOrmBaseRepositoryFactory<
      ProductVariant,
      {
        create: RequiredEntityData<ProductVariant>
        update: WithRequiredProperty<
          ProductVariantServiceTypes.UpdateProductVariantDTO,
          "id"
        >
      }
    >(ProductVariant)

  const defaultRepositories = {
    productCollectionRepository: defaultProductCollectionRepository,
    productOptionRepository: defaultProductOptionRepository,
    productOptionValueRepository: defaultProductOptionValueRepository,
    productTagRepository: defaultProductTagRepository,
    productTypeRepository: defaultProductTypeRepository,
    productVariantRepository: defaultProductVariantRepository,
  }

  if (customRepositories) {
    loadCustomRepositories({
      customRepositories,
      defaultRepositories,
      container,
    })
  } else {
    loadDefaultRepositories({ defaultRepositories, container })
  }
}

function loadDefaultRepositories({ defaultRepositories, container }) {
  container.register({
    baseRepository: asClass(BaseRepository).singleton(),
    productImageRepository: asClass(ProductImageRepository).singleton(),
    productCategoryRepository: asClass(ProductCategoryRepository).singleton(),
    productCollectionRepository: asClass(
      defaultRepositories.productCollectionRepository
    ).singleton(),
    productRepository: asClass(ProductRepository).singleton(),
    productTagRepository: asClass(
      defaultRepositories.productTagRepository
    ).singleton(),
    productTypeRepository: asClass(
      defaultRepositories.productTypeRepository
    ).singleton(),
    productOptionRepository: asClass(
      defaultRepositories.productOptionRepository
    ).singleton(),
    productOptionValueRepository: asClass(
      defaultRepositories.productOptionValueRepository
    ).singleton(),
    productVariantRepository: asClass(
      defaultRepositories.productVariantRepository
    ).singleton(),
  })
}

/**
 * Load the repositories from the custom repositories object. If a repository is not
 * present in the custom repositories object, the default repository will be used.
 *
 * @param defaultRepositories
 * @param customRepositories
 * @param container
 */
function loadCustomRepositories({
  defaultRepositories,
  customRepositories,
  container,
}) {
  const customRepositoriesMap = new Map(Object.entries(customRepositories))

  const allDefaultRepositories = {
    ...defaultRepositories,
    ...DefaultRepositories,
  }

  Object.entries(allDefaultRepositories).forEach(([key, DefaultRepository]) => {
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
