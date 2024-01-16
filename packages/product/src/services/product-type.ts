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
  InjectedDependencies,
  {
    create: ProductTypes.CreateProductTypeDTO
    update: ProductTypes.UpdateProductTypeDTO
  }
>(ProductType)<TEntity> {
  protected readonly productTypeRepository_: DAL.RepositoryService<TEntity>

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

  @InjectTransactionManager("productTypeRepository_")
  async upsert(
    types: UpsertProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const repo = this.productTypeRepository_ as unknown as ProductTypeRepository
    return (await repo.upsert!(types, sharedContext)) as TEntity[]
  }
}
