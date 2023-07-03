import { ProductCategory } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  productCategoryRepository: DAL.TreeRepositoryService
}

export default class ProductCategoryService<TEntity = ProductCategory> {
  protected readonly productCategoryRepository_: DAL.TreeRepositoryService

  constructor({ productCategoryRepository }: InjectedDependencies) {
    this.productCategoryRepository_ = productCategoryRepository
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

    const queryOptions = buildQuery<TEntity>(filters, config)
    queryOptions.where ??= {}

    return await this.productCategoryRepository_.find(
      queryOptions,
      transformOptions
    )
  }
}
