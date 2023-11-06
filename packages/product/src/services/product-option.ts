import { Context, DAL, FindConfig, ProductTypes } from "@medusajs/types"
import {
  composeMessage,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
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
    return (await (this.productOptionRepository_ as ProductOptionRepository)
      .upsert!(data, sharedContext)) as TEntity[]
  }
}
