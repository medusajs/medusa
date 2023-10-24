import {
  Context,
  CreateProductTypeDTO,
  DAL,
  FindConfig,
  ProductTypes,
  UpdateProductTypeDTO,
  UpsertProductTypeDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  composeMessage,
  retrieveEntity,
} from "@medusajs/utils"
import { ProductType } from "@models"
import { ProductTypeRepository } from "@repositories"

import { Modules } from "@medusajs/modules-sdk"
import { InternalContext, ProductTypeEvents } from "../types"
import { doNotForceTransaction, shouldForceTransaction } from "../utils"

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

  @InjectTransactionManager(doNotForceTransaction, "productTypeRepository_")
  async upsert(
    data: UpsertProductTypeDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<[TEntity[], TEntity[], TEntity[]]> {
    const [types, updatedTypes, insertedTypes] = await (
      this.productTypeRepository_ as ProductTypeRepository
    ).upsert!(data, sharedContext)

    sharedContext.messageAggregator?.save(
      updatedTypes.map(({ id }) => {
        return composeMessage(ProductTypeEvents.PRODUCT_TYPE_UPDATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductType.name,
          context: sharedContext,
        })
      })
    )

    sharedContext.messageAggregator?.save(
      insertedTypes.map(({ id }) => {
        return composeMessage(ProductTypeEvents.PRODUCT_TYPE_CREATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductType.name,
          context: sharedContext,
        })
      })
    )

    return [types, updatedTypes, insertedTypes] as [
      TEntity[],
      TEntity[],
      TEntity[]
    ]
  }

  @InjectTransactionManager(shouldForceTransaction, "productTypeRepository_")
  async create(
    data: CreateProductTypeDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    const types = await (
      this.productTypeRepository_ as ProductTypeRepository
    ).create(data, sharedContext)

    sharedContext.messageAggregator?.save(
      types.map(({ id }) => {
        return composeMessage(ProductTypeEvents.PRODUCT_TYPE_CREATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductType.name,
          context: sharedContext,
        })
      })
    )

    return types as TEntity[]
  }

  @InjectTransactionManager(shouldForceTransaction, "productTypeRepository_")
  async update(
    data: UpdateProductTypeDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    const types = await (
      this.productTypeRepository_ as ProductTypeRepository
    ).update(data, sharedContext)

    sharedContext.messageAggregator?.save(
      types.map(({ id }) => {
        return composeMessage(ProductTypeEvents.PRODUCT_TYPE_UPDATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductType.name,
          context: sharedContext,
        })
      })
    )

    return types as TEntity[]
  }

  @InjectTransactionManager(doNotForceTransaction, "productTypeRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<void> {
    await this.productTypeRepository_.delete(ids, sharedContext)

    sharedContext.messageAggregator?.save(
      ids.map((id) => {
        return composeMessage(ProductTypeEvents.PRODUCT_TYPE_DELETED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductType.name,
          context: sharedContext,
        })
      })
    )
  }
}
