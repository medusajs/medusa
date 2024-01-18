import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  composeMessage,
} from "@medusajs/utils"
import { ProductOption } from "@models"
import { ProductOptionRepository } from "@repositories"

import { Modules } from "@medusajs/modules-sdk"
import { InternalContext, ProductOptionEvents } from "../types"

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
  async create(
    data: ProductTypes.CreateProductOptionOnlyDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    const options = await (
      this.productOptionRepository_ as ProductOptionRepository
    ).create(data, sharedContext)

    sharedContext.messageAggregator?.save(
      options.map(({ id }) => {
        return composeMessage(ProductOptionEvents.PRODUCT_OPTION_CREATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductOption.name,
          context: sharedContext,
        })
      })
    )

    return options as TEntity[]
  }

  @InjectTransactionManager("productOptionRepository_")
  async update(
    data: ProductTypes.UpdateProductOptionDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    const options = await (
      this.productOptionRepository_ as ProductOptionRepository
    ).update(data, sharedContext)

    sharedContext.messageAggregator?.save(
      options.map(({ id }) => {
        return composeMessage(ProductOptionEvents.PRODUCT_OPTION_UPDATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductOption.name,
          context: sharedContext,
        })
      })
    )

    return options as TEntity[]
  }

  @InjectTransactionManager("productOptionRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<void> {
    await this.productOptionRepository_.delete(ids, sharedContext)

    sharedContext.messageAggregator?.save(
      ids.map((id) => {
        return composeMessage(ProductOptionEvents.PRODUCT_OPTION_DELETED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductOption.name,
          context: sharedContext,
        })
      })
    )
  }

  @InjectTransactionManager("productOptionRepository_")
  async upsert(
    data:
      | ProductTypes.CreateProductOptionDTO[]
      | ProductTypes.UpdateProductOptionDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productOptionRepository_.upsert!(data, sharedContext)
  }
}
