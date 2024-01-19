import { ProductType } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"
import { IProductTypeRepository } from "@types"

type InjectedDependencies = {
  productTypeRepository: DAL.RepositoryService
}

export default class ProductTypeService<
  TEntity extends ProductType = ProductType
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ProductTypes.CreateProductTypeDTO
    update: ProductTypes.UpdateProductTypeDTO
  }
>(ProductType)<TEntity> {
  protected readonly productTypeRepository_: IProductTypeRepository<TEntity>

  constructor(container: InjectedDependencies) {
    super(container)
    this.productTypeRepository_ = container.productTypeRepository
  }

  @InjectManager("productTypeRepository_")
  async list<TEntityMethod = ProductTypes.ProductTypeDTO>(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productTypeRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("productTypeRepository_")
  async listAndCount<TEntityMethod = ProductTypes.ProductOptionDTO>(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.productTypeRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList<TEntityMethod = ProductTypes.ProductTypeDTO>(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<TEntityMethod> = {}
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
