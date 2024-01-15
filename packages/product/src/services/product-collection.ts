import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"

import { ProductCollection } from "@models"

type InjectedDependencies = {
  productCollectionRepository: DAL.RepositoryService
}

export default class ProductCollectionService<
  TEntity extends ProductCollection = ProductCollection
> extends ModulesSdkUtils.abstractServiceFactory<
  ProductCollection,
  InjectedDependencies,
  {
    retrieve: ProductTypes.ProductCollectionDTO
    create: ProductTypes.CreateProductCollectionDTO
    update: ProductTypes.UpdateProductCollectionDTO
  }
>(ProductCollection) {
  protected readonly productCollectionRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    super(container)
    this.productCollectionRepository_ = container.productCollectionRepository
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
}
