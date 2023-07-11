import { ProductCategory } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { ModulesSdkUtils, MedusaError, isDefined } from "@medusajs/utils"

type InjectedDependencies = {
  productCategoryRepository: DAL.TreeRepositoryService
}

export default class ProductCategoryService<
  TEntity extends ProductCategory = ProductCategory
> {
  protected readonly productCategoryRepository_: DAL.TreeRepositoryService

  constructor({ productCategoryRepository }: InjectedDependencies) {
    this.productCategoryRepository_ = productCategoryRepository
  }

  async retrieve(
    productCategoryId: string,
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    sharedContext?: Context
  ): Promise<TEntity> {
    if (!isDefined(productCategoryId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productCategoryId" must be defined`
      )
    }

    const queryOptions = ModulesSdkUtils.buildQuery<ProductCategory>({
      id: productCategoryId,
    }, config)

    const transformOptions = {
      includeDescendantsTree: true,
    }

    const productCategories = await this.productCategoryRepository_.find(
      queryOptions,
      transformOptions,
      sharedContext
    )

    if (!productCategories?.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `ProductCategory with id: ${productCategoryId} was not found`
      )
    }

    return productCategories[0] as TEntity
  }

  async list(
    filters: ProductTypes.FilterableProductCategoryProps = {},
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    sharedContext?: Context
  ): Promise<TEntity[]> {
    const transformOptions = {
      includeDescendantsTree: filters?.include_descendants_tree || false,
    }
    delete filters.include_descendants_tree

    const queryOptions = ModulesSdkUtils.buildQuery<ProductCategory>(
      filters,
      config
    )
    queryOptions.where ??= {}

    return (await this.productCategoryRepository_.find(
      queryOptions,
      transformOptions,
      sharedContext
    )) as TEntity[]
  }

  async listAndCount(
    filters: ProductTypes.FilterableProductCategoryProps = {},
    config: FindConfig<ProductTypes.ProductCategoryDTO> = {},
    sharedContext?: Context
  ): Promise<[TEntity[], number]> {
    const transformOptions = {
      includeDescendantsTree: filters?.include_descendants_tree || false,
    }
    delete filters.include_descendants_tree

    const queryOptions = ModulesSdkUtils.buildQuery<ProductCategory>(
      filters,
      config
    )
    queryOptions.where ??= {}

    return (await this.productCategoryRepository_.findAndCount(
      queryOptions,
      transformOptions,
      sharedContext
    )) as [TEntity[], number]
  }
}
