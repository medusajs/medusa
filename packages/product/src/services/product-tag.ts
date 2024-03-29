import { ProductTag } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  productTagRepository: DAL.RepositoryService
}

export default class ProductTagService<
  TEntity extends ProductTag = ProductTag
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  ProductTag
)<TEntity> {
  protected readonly productTagRepository_: DAL.RepositoryService<TEntity>

  constructor(container: InjectedDependencies) {
    super(container)
    this.productTagRepository_ = container.productTagRepository
  }
  @InjectManager("productTagRepository_")
  async list(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<TEntity> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productTagRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("productTagRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<TEntity> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.productTagRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<TEntity> = {}
  ): DAL.FindOptions<TEntity> {
    const queryOptions = ModulesSdkUtils.buildQuery<TEntity>(filters, config)

    if (filters.value) {
      queryOptions.where.value = {
        $ilike: filters.value,
      } as DAL.FindOptions<TEntity>["where"]["value"]
    }

    return queryOptions
  }
}
