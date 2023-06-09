import { ProductCollection } from "@models"
import { DAL, FindConfig, ProductTypes, SharedContext } from "@medusajs/types"
import { buildQuery } from "../utils"

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
    sharedContext?: SharedContext
  ): Promise<TEntity[]> {
    const queryOptions = buildQuery<TEntity>(filters, config)
    queryOptions.where ??= {}

    if (filters.title) {
      queryOptions.where["title"] = { $like: filters.title }
    }

    return await this.productCollectionRepository_.find(queryOptions)
  }
}
