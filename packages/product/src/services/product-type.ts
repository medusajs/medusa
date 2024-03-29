import { ProductType } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  productTypeRepository: DAL.RepositoryService
}

export default class ProductTypeService<
  TEntity extends ProductType = ProductType
> extends ModulesSdkUtils.internalModuleServiceFactory<InjectedDependencies>(
  ProductType
)<TEntity> {
  protected readonly productTypeRepository_: DAL.RepositoryService<TEntity>

  constructor(container: InjectedDependencies) {
    super(container)
    this.productTypeRepository_ = container.productTypeRepository
  }

  @InjectManager("productTypeRepository_")
  async list(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<TEntity> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productTypeRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("productTypeRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<TEntity> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.productTypeRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList(
    filters: ProductTypes.FilterableProductTypeProps = {},
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
