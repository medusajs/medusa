import { ProductTag } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { InjectManager, MedusaContext, ModulesSdkUtils } from "@medusajs/utils"
import { IProductTagRepository } from "@types"

type InjectedDependencies = {
  productTagRepository: DAL.RepositoryService
}

export default class ProductTagService<
  TEntity extends ProductTag = ProductTag
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ProductTypes.CreateProductTagDTO
    update: ProductTypes.UpdateProductTagDTO
  }
>(ProductTag)<TEntity> {
  protected readonly productTagRepository_: IProductTagRepository<TEntity>

  constructor(container: InjectedDependencies) {
    super(container)
    this.productTagRepository_ = container.productTagRepository
  }
  @InjectManager("productTagRepository_")
  async list<TEntityMethod = ProductTypes.ProductTagDTO>(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productTagRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("productTagRepository_")
  async listAndCount<TEntityMethod = ProductTypes.ProductTagDTO>(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.productTagRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList<TEntityMethod = ProductTypes.ProductTagDTO>(
    filters: ProductTypes.FilterableProductTagProps = {},
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
