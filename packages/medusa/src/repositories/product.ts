import {
  Brackets,
  EntityRepository,
  FindOperator,
  In,
  Repository,
} from "typeorm"
import { PriceList, Product, SalesChannel } from "../models"
import { ExtendedFindConfig, Selector } from "../types/common"
import {
  getGroupedRelations,
  mergeEntitiesWithRelations,
  queryEntityWithIds,
} from "../utils/repository"

export type ProductSelector = Omit<Selector<Product>, "tags"> & {
  tags: FindOperator<string[]>
}

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<Product, ProductSelector>,
  "relations"
>

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  where: DefaultWithoutRelations["where"] & {
    price_list_id?: FindOperator<PriceList>
    sales_channel_id?: FindOperator<SalesChannel>
    discount_condition_id?: string
  }
}

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  private async queryProducts(
    optionsWithoutRelations: FindWithoutRelationsOptions,
    shouldCount = false
  ): Promise<[Product[], number]> {
    const tags = optionsWithoutRelations?.where?.tags
    delete optionsWithoutRelations?.where?.tags

    const price_lists = optionsWithoutRelations?.where?.price_list_id
    delete optionsWithoutRelations?.where?.price_list_id

    const sales_channels = optionsWithoutRelations?.where?.sales_channel_id
    delete optionsWithoutRelations?.where?.sales_channel_id

    const discount_condition_id =
      optionsWithoutRelations?.where?.discount_condition_id
    delete optionsWithoutRelations?.where?.discount_condition_id

    const qb = this.createQueryBuilder("product")
      .select(["product.id"])
      .skip(optionsWithoutRelations.skip)
      .take(optionsWithoutRelations.take)

    if (optionsWithoutRelations.where) {
      qb.where(optionsWithoutRelations.where)
    }

    if (optionsWithoutRelations.order) {
      const toSelect: string[] = []
      const parsed = Object.entries(optionsWithoutRelations.order).reduce(
        (acc, [k, v]) => {
          const key = `product.${k}`
          toSelect.push(key)
          acc[key] = v
          return acc
        },
        {}
      )
      qb.addSelect(toSelect)
      qb.orderBy(parsed)
    }

    if (tags) {
      qb.leftJoin("product.tags", "tags").andWhere(`tags.id IN (:...tag_ids)`, {
        tag_ids: tags.value,
      })
    }

    if (price_lists) {
      qb.leftJoin("product.variants", "variants")
        .leftJoin("variants.prices", "ma")
        .andWhere("ma.price_list_id IN (:...price_list_ids)", {
          price_list_ids: price_lists.value,
        })
    }

    if (sales_channels) {
      qb.innerJoin(
        "product.sales_channels",
        "sales_channels",
        "sales_channels.id IN (:...sales_channels_ids)",
        { sales_channels_ids: sales_channels.value }
      )
    }

    if (discount_condition_id) {
      qb.innerJoin(
        "discount_condition_product",
        "dc_product",
        `dc_product.product_id = product.id AND dc_product.condition_id = :dcId`,
        { dcId: discount_condition_id }
      )
    }

    if (optionsWithoutRelations.withDeleted) {
      qb.withDeleted()
    }

    let entities: Product[]
    let count = 0
    if (shouldCount) {
      const result = await qb.getManyAndCount()
      entities = result[0]
      count = result[1]
    } else {
      entities = await qb.getMany()
    }

    return [entities, count]
  }

  public async findWithRelationsAndCount(
    relations: string[] = [],
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
  ): Promise<[Product[], number]> {
    let count: number
    let entities: Product[]
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.findByIds(idsOrOptionsWithoutRelations, {
        withDeleted: idsOrOptionsWithoutRelations.withDeleted ?? false,
      })
      count = entities.length
    } else {
      const result = await this.queryProducts(
        idsOrOptionsWithoutRelations,
        true
      )
      entities = result[0]
      count = result[1]
    }
    const entitiesIds = entities.map(({ id }) => id)

    if (entitiesIds.length === 0) {
      // no need to continue
      return [[], count]
    }

    if (relations.length === 0) {
      const toReturn = await this.findByIds(
        entitiesIds,
        idsOrOptionsWithoutRelations
      )
      return [toReturn, toReturn.length]
    }

    const groupedRelations = getGroupedRelations(relations)
    const entitiesIdsWithRelations = await queryEntityWithIds(
      this,
      entitiesIds,
      groupedRelations,
      idsOrOptionsWithoutRelations.withDeleted,
      idsOrOptionsWithoutRelations.select,
      [
        (qb, alias, toplevel) => {
          const isCustomJoin = toplevel === "variants"
          if (isCustomJoin) {
            qb.leftJoinAndSelect(
              `${alias}.${toplevel}`,
              toplevel,
              "variants.deleted_at IS NULL"
            ).orderBy({
              "variants.variant_rank": "ASC",
            })
          }
          return !isCustomJoin
        },
      ]
    )

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
    const entitiesToReturn =
      mergeEntitiesWithRelations<Product>(entitiesAndRelations)

    return [entitiesToReturn, count]
  }

  public async findWithRelations(
    relations: string[] = [],
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions | string[] = {
      where: {},
    },
    withDeleted = false
  ): Promise<Product[]> {
    let entities: Product[]
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.findByIds(idsOrOptionsWithoutRelations, {
        withDeleted,
      })
    } else {
      const result = await this.queryProducts(
        idsOrOptionsWithoutRelations,
        false
      )
      entities = result[0]
    }
    const entitiesIds = entities.map(({ id }) => id)

    if (entitiesIds.length === 0) {
      // no need to continue
      return []
    }

    if (
      relations.length === 0 &&
      !Array.isArray(idsOrOptionsWithoutRelations)
    ) {
      return await this.findByIds(entitiesIds, idsOrOptionsWithoutRelations)
    }

    const groupedRelations = getGroupedRelations(relations)
    const entitiesIdsWithRelations = await queryEntityWithIds(
      this,
      entitiesIds,
      groupedRelations,
      withDeleted,
      [],
      [
        (qb, alias, toplevel) => {
          const isCustomJoin = toplevel === "variants"
          if (isCustomJoin) {
            qb.leftJoinAndSelect(
              `${alias}.${toplevel}`,
              toplevel,
              "variants.deleted_at IS NULL"
            ).orderBy({
              "variants.variant_rank": "ASC",
            })
          }
          return !isCustomJoin
        },
      ]
    )

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
    return mergeEntitiesWithRelations<Product>(entitiesAndRelations)
  }

  public async findOneWithRelations(
    relations: string[] = [],
    optionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
  ): Promise<Product> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }

  public async bulkAddToCollection(
    productIds: string[],
    collectionId: string
  ): Promise<Product[]> {
    await this.createQueryBuilder()
      .update(Product)
      .set({ collection_id: collectionId })
      .where({ id: In(productIds) })
      .execute()

    return this.findByIds(productIds)
  }

  public async bulkRemoveFromCollection(
    productIds: string[],
    collectionId: string
  ): Promise<Product[]> {
    await this.createQueryBuilder()
      .update(Product)
      .set({ collection_id: null })
      .where({ id: In(productIds), collection_id: collectionId })
      .execute()

    return this.findByIds(productIds)
  }

  public async getFreeTextSearchResultsAndCount(
    q: string,
    options: FindWithoutRelationsOptions = { where: {} },
    relations: string[] = []
  ): Promise<[Product[], number]> {
    const options_ = { ...options }
    const cleanedOptions = ProductRepository._cleanOptions(options_)

    let qb = this.createQueryBuilder("product")
      .leftJoinAndSelect("product.variants", "variant")
      .leftJoinAndSelect("product.collection", "collection")
      .select(["product.id"])
      .where(cleanedOptions.where)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`product.description ILIKE :q`, { q: `%${q}%` })
            .orWhere(`product.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`variant.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`variant.sku ILIKE :q`, { q: `%${q}%` })
            .orWhere(`collection.title ILIKE :q`, { q: `%${q}%` })
        })
      )
      .skip(cleanedOptions.skip)
      .take(cleanedOptions.take)

    const discountConditionId = options.where.discount_condition_id
    if (discountConditionId) {
      qb.innerJoin(
        "discount_condition_product",
        "dc_product",
        `dc_product.product_id = product.id AND dc_product.condition_id = :dcId`,
        { dcId: discountConditionId }
      )
    }

    if (cleanedOptions.withDeleted) {
      qb = qb.withDeleted()
    }

    const [results, count] = await qb.getManyAndCount()

    const products = await this.findWithRelations(
      relations,
      results.map((r) => r.id),
      cleanedOptions.withDeleted
    )

    return [products, count]
  }

  private static _cleanOptions(
    options: FindWithoutRelationsOptions
  ): FindWithoutRelationsOptions {
    const where = options.where ?? {}

    if ("description" in where) {
      delete where.description
    }

    if ("title" in where) {
      delete where.title
    }

    if ("price_list_id" in where) {
      delete where?.price_list_id
    }

    if ("discount_condition_id" in where) {
      delete where?.discount_condition_id
    }

    return {
      ...options,
      where,
    }
  }
}
