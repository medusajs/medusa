import { Modules } from "@medusajs/modules-sdk"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  composeMessage,
} from "@medusajs/utils"

import { ProductCollection } from "@models"
import { InternalContext, ProductCollectionEvents } from "../types"

type InjectedDependencies = {
  productCollectionRepository: DAL.RepositoryService
}

export default class ProductCollectionService<
  TEntity extends ProductCollection = ProductCollection
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ProductTypes.CreateProductCollectionDTO
    update: ProductTypes.UpdateProductCollectionDTO
  }
>(ProductCollection)<TEntity> {
  // eslint-disable-next-line max-len
  protected readonly productCollectionRepository_: DAL.RepositoryService<TEntity>

  constructor(container: InjectedDependencies) {
    super(container)
    this.productCollectionRepository_ = container.productCollectionRepository
  }

  @InjectManager("productCollectionRepository_")
  async list<TEntityMethod = ProductTypes.ProductCollectionDTO>(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productCollectionRepository_.find(
      this.buildListQueryOptions(filters, config),
      sharedContext
    )
  }

  @InjectManager("productCollectionRepository_")
  async listAndCount<TEntityMethod = ProductTypes.ProductCollectionDTO>(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.productCollectionRepository_.findAndCount(
      this.buildListQueryOptions(filters, config),
      sharedContext
    )
  }

  protected buildListQueryOptions<
    TEntityMethod = ProductTypes.ProductCollectionDTO
  >(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<TEntityMethod> = {}
  ): DAL.FindOptions<TEntity> {
    const queryOptions = ModulesSdkUtils.buildQuery<TEntity>(filters, config)

    queryOptions.where ??= {}

    if (filters.title) {
      queryOptions.where.title = {
        $like: `%${filters.title}%`,
      } as DAL.FindOptions<TEntity>["where"]["title"]
    }

    return queryOptions
  }

  @InjectTransactionManager("productCollectionRepository_")
  async create(
    data: ProductTypes.CreateProductCollectionDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    const collections = await this.productCollectionRepository_.create(
      data,
      sharedContext
    )

    sharedContext.messageAggregator?.save(
      collections.map(({ id }) => {
        return composeMessage(ProductCollectionEvents.COLLECTION_CREATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductCollection.name,
          context: sharedContext,
        })
      })
    )

    return collections as TEntity[]
  }

  @InjectTransactionManager("productCollectionRepository_")
  async update(
    data: ProductTypes.UpdateProductCollectionDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    const collections = await this.productCollectionRepository_.update(
      data,
      sharedContext
    )

    sharedContext.messageAggregator?.save(
      collections.map(({ id }) => {
        return composeMessage(ProductCollectionEvents.COLLECTION_UPDATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductCollection.name,
          context: sharedContext,
        })
      })
    )

    return collections as TEntity[]
  }

  @InjectTransactionManager("productCollectionRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<void> {
    await this.productCollectionRepository_.delete(ids, sharedContext)

    sharedContext.messageAggregator?.save(
      ids.map((id) => {
        return composeMessage(ProductCollectionEvents.COLLECTION_DELETED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductCollection.name,
          context: sharedContext,
        })
      })
    )
  }
}
