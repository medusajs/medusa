import {
  Context,
  DAL,
  FindConfig,
  ProductTypes,
  UpsertProductTypeDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  composeMessage,
} from "@medusajs/utils"
import { ProductType } from "@models"

import { Modules } from "@medusajs/modules-sdk"
import { CreateProductTypeDTO, UpdateProductTypeDTO } from "@medusajs/types"
import { ProductTypeEvents } from "../types"

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
    data: UpsertProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], TEntity[], TEntity[]]> {
    const [types, updatedTypes, insertedTypes] = await this
      .productTypeRepository_.upsert!(data, sharedContext)

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

  @InjectTransactionManager("productTypeRepository_")
  async create(
    data: CreateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const types = await this.productTypeRepository_.create(data, sharedContext)

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

  @InjectTransactionManager("productTypeRepository_")
  async update(
    data: UpdateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const types = await this.productTypeRepository_.update(data, sharedContext)

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

  @InjectTransactionManager("productTypeRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
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
