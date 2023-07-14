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
  retrieveEntity,
} from "@medusajs/utils"
import { ProductTagRepository } from "@repositories"

import { doNotForceTransaction } from "../utils"

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

  async retrieve(
    productTagId: string,
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    sharedContext?: Context
  ): Promise<TEntity> {
    return (await retrieveEntity<
      ProductTag,
      ProductTypes.ProductTagDTO
    >({
      id: productTagId,
      entityName: ProductTag.name,
      repository: this.productTagRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  async list(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    sharedContext?: Context
  ): Promise<TEntity[]> {
    return (await this.productTagRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  async listAndCount(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    sharedContext?: Context
  ): Promise<[TEntity[], number]> {
    return (await this.productTagRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<ProductTag>(filters, config)

    if (filters.value) {
      queryOptions.where["value"] = { $ilike: filters.value }
    }

    return queryOptions
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
