import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  ProductService,
  ProductVariantService,
  ProductModuleService,
  ProductTagService,
  ProductCategoryService,
  ProductCollectionService,
  ProductImageService,
  ProductTypeService,
  ProductOptionService,
} from "@services"

import {
  ProductRepository,
  ProductVariantRepository,
  BaseRepository,
  ProductTagRepository,
  ProductCategoryRepository,
  ProductCollectionRepository,
  ProductImageRepository,
  ProductTypeRepository,
  ProductOptionRepository,
} from "@repositories"

type SetupModuleServiceParams = {
  repositoryManager: SqlEntityManager
}

export const setupModuleService = ({
  repositoryManager
}: SetupModuleServiceParams) => {
  // Setup repositories
  const baseRepository = new BaseRepository({ manager: repositoryManager })

  const productRepository = new ProductRepository({
    manager: repositoryManager,
  })

  const productVariantRepository = new ProductVariantRepository({
    manager: repositoryManager,
  })

  const productTagRepository = new ProductTagRepository({
    manager: repositoryManager,
  })

  const productCategoryRepository = new ProductCategoryRepository({
    manager: repositoryManager,
  })

  const productCollectionRepository = new ProductCollectionRepository({
    manager: repositoryManager,
  })

  const productImageRepository = new ProductImageRepository({
    manager: repositoryManager,
  })

  const productTypeRepository = new ProductTypeRepository({
    manager: repositoryManager,
  })

  const productOptionRepository = new ProductOptionRepository({
    manager: repositoryManager,
  })

  // Setup Services
  const productService = new ProductService({
    productRepository,
  })

  const productVariantService = new ProductVariantService({
    productService,
    productVariantRepository,
  })

  const productTagService = new ProductTagService({
    productTagRepository,
  })

  const productCategoryService = new ProductCategoryService({
    productCategoryRepository,
  })

  const productCollectionService = new ProductCollectionService({
    productCollectionRepository,
  })

  const productImageService = new ProductImageService({
    productImageRepository,
  })

  const productTypeService = new ProductTypeService({
    productTypeRepository
  })

  const productOptionService = new ProductOptionService({
    productOptionRepository
  })

  return new ProductModuleService({
    baseRepository,
    productService,
    productVariantService,
    productTagService,
    productCategoryService,
    productCollectionService,
    productImageService,
    productTypeService,
    productOptionService,
  })
}
