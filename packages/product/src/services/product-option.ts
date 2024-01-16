import { ProductOption } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { ProductOptionRepository } from "@repositories"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"

type InjectedDependencies = {
  productOptionRepository: DAL.RepositoryService
}

export default class ProductOptionService<
  TEntity extends ProductOption = ProductOption
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ProductTypes.CreateProductOptionDTO
    update: ProductTypes.UpdateProductOptionDTO
  }
>(ProductOption)<TEntity> {
  protected readonly productOptionRepository_: DAL.RepositoryService<TEntity>

  constructor(container: InjectedDependencies) {
    super(container)
    this.productOptionRepository_ = container.productOptionRepository
  }

  @InjectManager("productOptionRepository_")
  async list<TEntityMethod = ProductTypes.ProductOptionDTO>(
    filters: ProductTypes.FilterableProductOptionProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<TEntity[]> {
    return await this.productOptionRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("productOptionRepository_")
  async listAndCount<TEntityMethod = ProductTypes.ProductOptionDTO>(
    filters: ProductTypes.FilterableProductOptionProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<[TEntity[], number]> {
    return await this.productOptionRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList<TEntityMethod = ProductTypes.ProductOptionDTO>(
    filters: ProductTypes.FilterableProductOptionProps = {},
    config: FindConfig<TEntityMethod> = {}
  ): DAL.FindOptions<TEntity> {
    const queryOptions = ModulesSdkUtils.buildQuery<TEntity>(filters, config)

    if (filters.title) {
      queryOptions.where.title = {
        $ilike: filters.title,
      } as DAL.FindOptions<TEntity>["where"]["title"]
    }

    return queryOptions
  }

  @InjectTransactionManager("productOptionRepository_")
  async upsert(
    data:
      | ProductTypes.CreateProductOptionDTO[]
      | ProductTypes.UpdateProductOptionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const repo = this
      .productOptionRepository_ as unknown as ProductOptionRepository
    return (await repo.upsert!(data, sharedContext)) as TEntity[]
  }
}
