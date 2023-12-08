import { ProductOption } from "@models"
import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import { ProductOptionRepository } from "@repositories"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"

type InjectedDependencies = {
  productOptionRepository: DAL.RepositoryService
}

export default class ProductOptionService<
  TEntity extends ProductOption = ProductOption
> {
  protected readonly productOptionRepository_: DAL.RepositoryService

  constructor({ productOptionRepository }: InjectedDependencies) {
    this.productOptionRepository_ =
      productOptionRepository as ProductOptionRepository
  }

  @InjectManager("productOptionRepository_")
  async retrieve(
    productOptionId: string,
    config: FindConfig<ProductTypes.ProductOptionDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<TEntity> {
    return (await retrieveEntity<ProductOption, ProductTypes.ProductOptionDTO>({
      id: productOptionId,
      entityName: ProductOption.name,
      repository: this.productOptionRepository_,
      config,
      sharedContext,
    })) as TEntity
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
  async create(
    data: ProductTypes.CreateProductOptionOnlyDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.productOptionRepository_ as ProductOptionRepository
    ).create(data, {
      transactionManager: sharedContext.transactionManager,
    })) as TEntity[]
  }

  @InjectTransactionManager("productOptionRepository_")
  async update(
    data: ProductTypes.UpdateProductOptionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (
      this.productOptionRepository_ as ProductOptionRepository
    ).update(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager("productOptionRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    return await this.productOptionRepository_.delete(ids, sharedContext)
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
