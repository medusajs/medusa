import { ProductTag } from "@models"
import {
  Context,
  CreateProductTagDTO,
  DAL,
  FindConfig,
  ProductTypes,
  UpdateProductTagDTO,
  UpsertProductTagDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { ProductTagRepository } from "@repositories"

import { shouldForceTransaction } from "../utils"

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

  @InjectManager("productTagRepository_")
  async retrieve(
    productTagId: string,
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<ProductTag, ProductTypes.ProductTagDTO>({
      id: productTagId,
      entityName: ProductTag.name,
      repository: this.productTagRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("productTagRepository_")
  async list(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.productTagRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("productTagRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.productTagRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<ProductTag>(filters, config)

    if (filters.value) {
      queryOptions.where["value"] = { $ilike: filters.value }
    }

    return queryOptions
  }

  @InjectTransactionManager("productTagRepository_")
  async create(
    data: CreateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.productTagRepository_ as ProductTagRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("productTagRepository_")
  async update(
    data: UpdateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.productTagRepository_ as ProductTagRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("productTagRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productTagRepository_.delete(ids, sharedContext)
  }

  @InjectTransactionManager("productTagRepository_")
  async upsert(
    data: UpsertProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.productTagRepository_ as ProductTagRepository).upsert!(
      data,
      sharedContext
    )) as TEntity[]
  }
}
