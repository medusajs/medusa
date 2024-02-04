import { ProductOption } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  productOptionRepository: DAL.RepositoryService
}

export default class ProductOptionService<
  TEntity extends ProductOption = ProductOption
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  ProductOption
)<TEntity> {
  protected readonly productOptionRepository_: DAL.RepositoryService<TEntity>

  constructor(container: InjectedDependencies) {
    super(container)
    this.productOptionRepository_ = container.productOptionRepository
  }

  @InjectManager("productOptionRepository_")
  async list(
    filters: ProductTypes.FilterableProductOptionProps = {},
    config: FindConfig<TEntity> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<TEntity[]> {
    return await this.productOptionRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("productOptionRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductOptionProps = {},
    config: FindConfig<TEntity> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<[TEntity[], number]> {
    return await this.productOptionRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList(
    filters: ProductTypes.FilterableProductOptionProps = {},
    config: FindConfig<TEntity> = {}
  ): DAL.FindOptions<TEntity> {
    const queryOptions = ModulesSdkUtils.buildQuery<TEntity>(filters, config)

    if (filters.title) {
      queryOptions.where.title = {
        $ilike: filters.title,
      } as DAL.FindOptions<TEntity>["where"]["title"]
    }

    return queryOptions
  }
}
