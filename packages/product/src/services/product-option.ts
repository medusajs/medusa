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
  ProductOption,
  InjectedDependencies,
  {
    retrieve: ProductTypes.ProductOptionDTO
    create: ProductTypes.CreateProductOptionDTO
    update: ProductTypes.UpdateProductOptionDTO
  }
>(ProductOption) {
  protected readonly productOptionRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    super(container)
    this.productOptionRepository_ =
      container.productOptionRepository as ProductOptionRepository
  }

  @InjectManager("productOptionRepository_")
  async list(
    filters: ProductTypes.FilterableProductOptionProps = {},
    config: FindConfig<ProductTypes.ProductOptionDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<TEntity[]> {
    return (await this.productOptionRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("productOptionRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductOptionProps = {},
    config: FindConfig<ProductTypes.ProductOptionDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<[TEntity[], number]> {
    return (await this.productOptionRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: ProductTypes.FilterableProductOptionProps = {},
    config: FindConfig<ProductTypes.ProductOptionDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<ProductOption>(
      filters,
      config
    )

    if (filters.title) {
      queryOptions.where["title"] = { $ilike: filters.title }
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
    return (await (this.productOptionRepository_ as ProductOptionRepository)
      .upsert!(data, sharedContext)) as TEntity[]
  }
}
