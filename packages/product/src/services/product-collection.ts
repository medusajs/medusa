import { ProductCollection } from "@models"
import { DAL, FindConfig, ProductTypes, SharedContext } from "@medusajs/types"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  productCollectionRepository: DAL.RepositoryService
}

export default class ProductCollectionService {
  protected readonly productCollectionRepository_: DAL.RepositoryService

  constructor({ productCollectionRepository }: InjectedDependencies) {
    this.productCollectionRepository_ = productCollectionRepository
  }

  async list<T = ProductCollection>(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    sharedContext?: SharedContext
  ): Promise<T[]> {
    const queryOptions = buildQuery<T>(filters, config)
    queryOptions.where ??= {}

    if (filters.title) {
      queryOptions.where["title"] = { $like: filters.title }
    }

    // TODO: remove
    if (filters.id) {
      queryOptions.where["id"] = filters.id
    }

    return await this.productCollectionRepository_.find<T>(queryOptions)
  }
}
