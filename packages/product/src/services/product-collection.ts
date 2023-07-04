import { ProductCollection } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  productCollectionRepository: DAL.RepositoryService
}

export default class ProductCollectionService<TEntity = ProductCollection> {
  protected readonly productCollectionRepository_: DAL.RepositoryService<TEntity>

  constructor({ productCollectionRepository }: InjectedDependencies) {
    this.productCollectionRepository_ = productCollectionRepository
  }

  async list(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    sharedContext?: Context
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<TEntity>(filters, config)
    queryOptions.where ??= {}

    if (filters.title) {
      queryOptions.where["title"] = { $like: filters.title }
    }

    return await this.productCollectionRepository_.find(
      queryOptions,
      sharedContext
    )
  }
}
