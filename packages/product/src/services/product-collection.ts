import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import {
  ModulesSdkUtils,
  retrieveEntity,
  InjectTransactionManager,
  MedusaContext,
  InjectManager,
} from "@medusajs/utils"

import { shouldForceTransaction } from "../utils"
import { ProductCollectionRepository } from "../repositories"

import { ProductCollection } from "@models"

type InjectedDependencies = {
  productCollectionRepository: DAL.RepositoryService
}

export default class ProductCollectionService<
  TEntity extends ProductCollection = ProductCollection
> {
  protected readonly productCollectionRepository_: DAL.RepositoryService

  constructor({ productCollectionRepository }: InjectedDependencies) {
    this.productCollectionRepository_ = productCollectionRepository
  }

  @InjectManager("productCollectionRepository_")
  async retrieve(
    productCollectionId: string,
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<
      ProductCollection,
      ProductTypes.ProductCollectionDTO
    >({
      id: productCollectionId,
      entityName: ProductCollection.name,
      repository: this.productCollectionRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("productCollectionRepository_")
  async list(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.productCollectionRepository_.find(
      this.buildListQueryOptions(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("productCollectionRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.productCollectionRepository_.findAndCount(
      this.buildListQueryOptions(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  protected buildListQueryOptions(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<ProductTypes.ProductCollectionDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<ProductCollection>(
      filters,
      config
    )

    queryOptions.where ??= {}

    if (filters.title) {
      queryOptions.where["title"] = { $like: filters.title }
    }

    return queryOptions
  }

  @InjectTransactionManager(shouldForceTransaction, "productCollectionRepository_")
  async create(
    data: ProductTypes.CreateProductCollectionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.productCollectionRepository_ as ProductCollectionRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(shouldForceTransaction, "productCollectionRepository_")
  async update(
    data: ProductTypes.UpdateProductCollectionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.productCollectionRepository_ as ProductCollectionRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager(shouldForceTransaction, "productCollectionRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productCollectionRepository_.delete(ids, sharedContext)
  }
}
