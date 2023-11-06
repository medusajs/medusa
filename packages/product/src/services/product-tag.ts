import {
  Context,
  CreateProductTagDTO,
  DAL,
  FindConfig,
  ProductTypes,
  UpdateProductTagDTO,
  UpsertProductTagDTO,
} from "@medusajs/types"
import {
  composeMessage,
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  retrieveEntity,
} from "@medusajs/utils"
import { ProductTag } from "@models"
import { ProductTagRepository } from "@repositories"

import { Modules } from "@medusajs/modules-sdk"
import { InternalContext, ProductTagEvents } from "../types"

type InjectedDependencies = {
  productTagRepository: DAL.RepositoryService
}

export default class ProductTagService<
  TEntity extends ProductTag = ProductTag
> {
  protected readonly productTagRepository_: DAL.RepositoryService

  constructor({ productTagRepository }: InjectedDependencies) {
    this.productTagRepository_ = productTagRepository
  }

  @InjectManager("productTagRepository_")
  async retrieve(
    productTagId: string,
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity> {
    return (await retrieveEntity<ProductTag, ProductTypes.ProductTagDTO>({
      id: productTagId,
      entityName: ProductTag.name,
      repository: this.productTagRepository_,
      config,
      sharedContext,
    })) as TEntity
  }

  @InjectManager("productTagRepository_")
  async list(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await this.productTagRepository_.find(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as TEntity[]
  }

  @InjectManager("productTagRepository_")
  async listAndCount(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[TEntity[], number]> {
    return (await this.productTagRepository_.findAndCount(
      this.buildQueryForList(filters, config),
      sharedContext
    )) as [TEntity[], number]
  }

  private buildQueryForList(
    filters: ProductTypes.FilterableProductTagProps = {},
    config: FindConfig<ProductTypes.ProductTagDTO> = {}
  ) {
    const queryOptions = ModulesSdkUtils.buildQuery<ProductTag>(filters, config)

    if (filters.value) {
      queryOptions.where["value"] = { $ilike: filters.value }
    }

    return queryOptions
  }

  @InjectTransactionManager("productTagRepository_")
  async create(
    data: CreateProductTagDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    const tags = await (
      this.productTagRepository_ as ProductTagRepository
    ).create(data, sharedContext)

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
    data: UpdateProductTagDTO[],
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<TEntity[]> {
    const tags = await (
      this.productTagRepository_ as ProductTagRepository
    ).update(data, sharedContext)

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
    @MedusaContext() sharedContext: InternalContext = {}
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
    @MedusaContext() sharedContext: InternalContext = {}
  ): Promise<[TEntity[], TEntity[], TEntity[]]> {
    const [tags, updatedTags, insertedTags] = await (
      this.productTagRepository_ as ProductTagRepository
    ).upsert!(data, sharedContext)

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

    return [tags, updatedTags, insertedTags] as [
      TEntity[],
      TEntity[],
      TEntity[]
    ]
  }
}
