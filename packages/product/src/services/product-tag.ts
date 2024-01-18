import {
  Context,
  DAL,
  FindConfig,
  ProductTypes,
  UpsertProductTagDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  composeMessage,
} from "@medusajs/utils"
import { ProductTag } from "@models"

import { Modules } from "@medusajs/modules-sdk"
import { ProductTagEvents } from "../types"

type InjectedDependencies = {
  productTagRepository: DAL.RepositoryService
}

export default class ProductTagService<
  TEntity extends ProductTag = ProductTag
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: ProductTypes.CreateProductTagDTO
    update: ProductTypes.UpdateProductTagDTO
  }
>(ProductTag)<TEntity> {
  protected readonly productTagRepository_: DAL.RepositoryService<TEntity>

  constructor(container: InjectedDependencies) {
    super(container)
    this.productTagRepository_ = container.productTagRepository
  }
  @InjectManager("productTagRepository_")
  async list<TEntityMethod = ProductTypes.ProductTagDTO>(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return await this.productTagRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  @InjectManager("productTagRepository_")
  async listAndCount<TEntityMethod = ProductTypes.ProductTagDTO>(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<TEntityMethod> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return await this.productTagRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )
  }

  private buildQueryForList<TEntityMethod = ProductTypes.ProductTagDTO>(
    filters: ProductTypes.FilterableProductTagProps = {},
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

  @InjectTransactionManager("productTagRepository_")
  async create(
    data: ProductTypes.CreateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const tags = await this.productTagRepository_.create(data, sharedContext)

    sharedContext.messageAggregator?.save(
      tags.map(({ id }) => {
        return composeMessage(ProductTagEvents.PRODUCT_TAG_CREATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductTag.name,
          context: sharedContext,
        })
      })
    )

    return tags as TEntity[]
  }

  @InjectTransactionManager("productTagRepository_")
  async update(
    data: ProductTypes.UpdateProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    const tags = await this.productTagRepository_.update(data, sharedContext)

    sharedContext.messageAggregator?.save(
      tags.map(({ id }) => {
        return composeMessage(ProductTagEvents.PRODUCT_TAG_UPDATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductTag.name,
          context: sharedContext,
        })
      })
    )

    return tags as TEntity[]
  }

  @InjectTransactionManager("productTagRepository_")
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.productTagRepository_.delete(ids, sharedContext)

    sharedContext.messageAggregator?.save(
      ids.map((id) => {
        return composeMessage(ProductTagEvents.PRODUCT_TAG_DELETED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductTag.name,
          context: sharedContext,
        })
      })
    )
  }

  @InjectTransactionManager("productTagRepository_")
  async upsert(
    data: UpsertProductTagDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], TEntity[], TEntity[]]> {
    const [tags, updatedTags, insertedTags] = await this.productTagRepository_
      .upsert!(data, sharedContext)

    sharedContext.messageAggregator?.save(
      updatedTags.map(({ id }) => {
        return composeMessage(ProductTagEvents.PRODUCT_TAG_UPDATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductTag.name,
          context: sharedContext,
        })
      })
    )

    sharedContext.messageAggregator?.save(
      insertedTags.map(({ id }) => {
        return composeMessage(ProductTagEvents.PRODUCT_TAG_CREATED, {
          data: { id },
          service: Modules.PRODUCT,
          entity: ProductTag.name,
          context: sharedContext,
        })
      })
    )

    return [tags, updatedTags, insertedTags]
  }
}
