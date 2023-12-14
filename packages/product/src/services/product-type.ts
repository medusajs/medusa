import { ProductType } from "@models"
import {
  Context,
  CreateProductTypeDTO,
  DAL,
  FindConfig,
  ProductTypes,
  UpdateProductTypeDTO,
  UpsertProductTypeDTO,
} from "@medusajs/types"
import { ProductTypeRepository } from "@repositories"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"

import { shouldForceTransaction } from "../utils"

type InjectedDependencies = {
  productTypeRepository: DAL.RepositoryService
}

export default class ProductTypeService<
  TEntity extends ProductType = ProductType
> {
  protected readonly productTypeRepository_: DAL.RepositoryService

  constructor({ productTypeRepository }: InjectedDependencies) {
    this.productTypeRepository_ = productTypeRepository
  }

  @InjectManager("productTypeRepository_")
  async retrieve(
    productTypeId: string,
    config: FindConfig<ProductTypes.ProductTypeDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<ProductType, ProductTypes.ProductTypeDTO>({
      id: productTypeId,
      entityName: ProductType.name,
      repository: this.productTypeRepository_,
      config,
      sharedContext,
    })) as TEntity
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

  @InjectTransactionManager("productTypeRepository_")
  async create(
    data: CreateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.productTypeRepository_ as ProductTypeRepository).create(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("productTypeRepository_")
  async update(
    data: UpdateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.productTypeRepository_ as ProductTypeRepository).update(
      data,
      sharedContext
    )) as TEntity[]
  }

  @InjectTransactionManager("productTypeRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productTypeRepository_.delete(ids, sharedContext)
  }
}
