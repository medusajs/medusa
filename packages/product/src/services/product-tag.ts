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

export default class ProductTagService<
  TEntity extends ProductTag = ProductTag
> {
  protected readonly productTagRepository_: DAL.RepositoryService

  constructor({ productTagRepository }: InjectedDependencies) {
    this.productTagRepository_ = productTagRepository
  }

  async list(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    sharedContext?: Context
  ): Promise<TEntity[]> {
    const queryOptions = ModulesSdkUtils.buildQuery<ProductTag>(filters, config)

    if (filters.value) {
      queryOptions.where.value = "test"
    }

    return (await this.productTagRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  async upsert(
    tags: CreateProductTagDTO[],
    sharedContext?: Context
  ): Promise<TEntity[]> {
    return (await this.productTagRepository_.upsert!(
      tags,
      sharedContext
    )) as TEntity[]
  }
}
