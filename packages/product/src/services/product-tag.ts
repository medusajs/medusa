import { ProductTag } from "@models"
import {
  Context,
  CreateProductTagDTO,
  DAL,
  FindConfig,
  ProductTypes,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { doNotForceTransaction } from "../utils"
import { ProductTagRepository } from "@repositories"

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
      queryOptions.where["value"] = { $ilike: filters.value }
    }

    return (await this.productTagRepository_.find(
      queryOptions,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "productTagRepository_")
  async upsert(
    tags: CreateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.productTagRepository_ as ProductTagRepository).upsert!(
      tags,
      sharedContext
    )) as TEntity[]
  }
}
