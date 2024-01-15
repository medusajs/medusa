import { ProductType } from "@models"
import {
  Context,
  DAL,
  FindConfig,
  ProductTypes,
  UpsertProductTypeDTO,
} from "@medusajs/types"
import { ProductTypeRepository } from "@repositories"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"

type InjectedDependencies = {
  productTypeRepository: DAL.RepositoryService
}

export default class ProductTypeService<
  TEntity extends ProductType = ProductType
> extends ModulesSdkUtils.abstractServiceFactory<
  ProductType,
  InjectedDependencies,
  {
    retrieve: ProductTypes.ProductTypeDTO
    create: ProductTypes.CreateProductTypeDTO
    update: ProductTypes.UpdateProductTypeDTO
  }
>(ProductType) {
  protected readonly productTypeRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    super(container)
    this.productTypeRepository_ = container.productTypeRepository
  }

  @InjectManager("productTypeRepository_")
  async list(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<ProductTypes.ProductTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.productTypeRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("productTypeRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<ProductTypes.ProductTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.productTypeRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: ProductTypes.FilterableProductTypeProps = {},
    config: FindConfig<ProductTypes.ProductTypeDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<ProductType>(
      filters,
      config
    )

    if (filters.value) {
      queryOptions.where["value"] = { $ilike: filters.value }
    }

    return queryOptions
  }

  @InjectTransactionManager("productTypeRepository_")
  async upsert(
    types: UpsertProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.productTypeRepository_ as ProductTypeRepository)
      .upsert!(types, sharedContext)) as TEntity[]
  }
}
