import { ProductTag } from "@models"
import {
  Context,
  DAL,
  FindConfig,
  ProductTypes,
  UpsertProductTagDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { ProductTagRepository } from "@repositories"

type InjectedDependencies = {
  productTagRepository: DAL.RepositoryService
}

export default class ProductTagService<
  TEntity extends ProductTag = ProductTag
> extends ModulesSdkUtils.abstractServiceFactory<
  ProductTag,
  InjectedDependencies,
  {
    retrieve: ProductTypes.ProductTagDTO
    create: ProductTypes.CreateProductTagDTO
    update: ProductTypes.UpdateProductTagDTO
  }
>(ProductTag) {
  protected readonly productTagRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    super(container)
    this.productTagRepository_ = container.productTagRepository
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
