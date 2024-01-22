import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"

import { ProductCollection } from "@models"
import {
  IProductCollectionRepository,
  ProductCollectionServiceTypes,
} from "@types"
import {
  CreateProductCollection,
  UpdateProductCollection,
} from "../types/services/product-collection"

type InjectedDependencies = {
  productCollectionRepository: DAL.RepositoryService
}

export default class ProductCollectionService<
  TEntity extends ProductCollection = ProductCollection
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateProductCollection
    update: UpdateProductCollection
  }
>(ProductCollection)<TEntity> {
  // eslint-disable-next-line max-len
  protected readonly productCollectionRepository_: IProductCollectionRepository<TEntity>

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
    data: ProductCollectionServiceTypes.CreateProductCollection[],
    context: Context = {}
  ): Promise<TEntity[]> {
    const productCollections = data.map((collectionData) => {
      if (collectionData.product_ids) {
        collectionData.products = collectionData.product_ids

        delete collectionData.product_ids
      }

      return collectionData
    })

    return super.create(productCollections, context)
  }

  @InjectTransactionManager("productCollectionRepository_")
  async update(
    data: ProductCollectionServiceTypes.UpdateProductCollection[],
    context: Context = {}
  ): Promise<TEntity[]> {
    const productCollections = data.map((collectionData) => {
      if (collectionData.product_ids) {
        collectionData.products = collectionData.product_ids

        delete collectionData.product_ids
      }

      return collectionData
    })

    return super.update(productCollections, context)
  }
}
