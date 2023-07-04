import { ProductTag } from "@models"
import {
  Context,
  CreateProductTagDTO,
  DAL,
  FindConfig,
  ProductTypes,
} from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  productTagRepository: DAL.RepositoryService
}

export default class ProductTagService<TEntity = ProductTag> {
  protected readonly productTagRepository_: DAL.RepositoryService<TEntity>

  constructor({ productTagRepository }: InjectedDependencies) {
    this.productTagRepository_ = productTagRepository
  }

  async list(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    sharedContext?: Context
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<TEntity>(filters, config)

    if (filters.value) {
      queryOptions.where["value"] = { $ilike: filters.value }
    }

    return await this.productTagRepository_.find(queryOptions, sharedContext)
  }

  upsert(tags: CreateProductTagDTO[], sharedContext?: Context) {
    return this.productTagRepository_.upsert(tags, sharedContext)
  }
}
