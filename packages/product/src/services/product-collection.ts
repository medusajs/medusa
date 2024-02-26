import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"

import { ProductCollection } from "@models"
import { ProductCollectionServiceTypes } from "@types"

type InjectedDependencies = {
  productCollectionRepository: DAL.RepositoryService
}

export default class ProductCollectionService<
  TEntity extends ProductCollection = ProductCollection
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  ProductCollection
)<TEntity> {
  // eslint-disable-next-line max-len
  protected readonly productCollectionRepository_: DAL.RepositoryService<TEntity>

  constructor(container: InjectedDependencies) {
    super(container)
    this.productCollectionRepository_ = container.productCollectionRepository
  }

  @InjectManager("productCollectionRepository_")
  async list(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<TEntity> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productCollectionRepository_.find(
      this.buildListQueryOptions(filters, config),
      sharedContext
    )
  }

  @InjectManager("productCollectionRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<TEntity> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.productCollectionRepository_.findAndCount(
      this.buildListQueryOptions(filters, config),
      sharedContext
    )
  }

  protected buildListQueryOptions(
    filters: ProductTypes.FilterableProductCollectionProps = {},
    config: FindConfig<TEntity> = {}
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

  create(
    data: ProductCollectionServiceTypes.CreateProductCollection,
    context?: Context
  ): Promise<TEntity>
  create(
    data: ProductCollectionServiceTypes.CreateProductCollection[],
    context?: Context
  ): Promise<TEntity[]>

  @InjectTransactionManager("productCollectionRepository_")
  async create(
    data:
      | ProductCollectionServiceTypes.CreateProductCollection
      | ProductCollectionServiceTypes.CreateProductCollection[],
    context: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]
    const productCollections = data_.map((collectionData) => {
      if (collectionData.product_ids) {
        collectionData.products = collectionData.product_ids

        delete collectionData.product_ids
      }

      return collectionData
    })

    return super.create(productCollections, context)
  }

  // @ts-ignore
  update(
    data: ProductCollectionServiceTypes.UpdateProductCollection,
    context?: Context
  ): Promise<TEntity>
  // @ts-ignore
  update(
    data: ProductCollectionServiceTypes.UpdateProductCollection[],
    context?: Context
  ): Promise<TEntity[]>

  @InjectTransactionManager("productCollectionRepository_")
  // @ts-ignore Do not implement all the expected overloads, see if we must do it
  async update(
    data:
      | ProductCollectionServiceTypes.UpdateProductCollection
      | ProductCollectionServiceTypes.UpdateProductCollection[],
    context: Context = {}
  ): Promise<TEntity | TEntity[]> {
    const data_ = Array.isArray(data) ? data : [data]
    const productCollections = data_.map((collectionData) => {
      if (collectionData.product_ids) {
        collectionData.products = collectionData.product_ids

        delete collectionData.product_ids
      }

      return collectionData
    })

    return super.update(productCollections, context)
  }
}
