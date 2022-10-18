import {
  Brackets,
  EntityRepository,
  FindOperator,
  In,
  Repository,
  SelectQueryBuilder,
} from "typeorm"
import { PriceList, Product, SalesChannel } from "../models"
import { ExtendedFindConfig, Selector } from "../types/common"
import {
  getGroupedRelations,
  mergeEntitiesWithRelations,
  queryEntityWithIds,
  queryEntityWithoutRelations,
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
  public async findWithRelationsAndCount(
    relations: string[] = [],
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions | string[] = {
      where: {},
    },
    withDeleted = false
  ): Promise<[Product[], number]> {
    let count: number
    let entities: Product[]

    const ids = Array.isArray(idsOrOptionsWithoutRelations)
      ? (idsOrOptionsWithoutRelations as string[])
      : undefined
    const optionsWithoutRelations = !ids
      ? (idsOrOptionsWithoutRelations as FindWithoutRelationsOptions)
      : undefined

    if (ids) {
      entities = await this.findByIds(ids, {
        withDeleted,
      })
      count = entities.length
    } else {
      const customJoinsBuilders: ((
        qb: SelectQueryBuilder<Product>,
        alias: string
      ) => void)[] = []

      if (optionsWithoutRelations?.where?.tags) {
        const tags = optionsWithoutRelations?.where?.tags
        delete optionsWithoutRelations?.where?.tags

        customJoinsBuilders.push(
          (qb: SelectQueryBuilder<Product>, alias: string) => {
            qb.leftJoin(`${alias}.tags`, "tags").andWhere(
              `tags.id IN (:...tag_ids)`,
              {
                tag_ids: tags.value,
              }
            )
          }
        )
      }

      if (optionsWithoutRelations?.where?.price_list_id) {
        const price_lists = optionsWithoutRelations?.where?.price_list_id
        delete optionsWithoutRelations?.where?.price_list_id

        customJoinsBuilders.push(
          (qb: SelectQueryBuilder<Product>, alias: string) => {
            qb.leftJoin(`${alias}.variants`, "variants")
              .leftJoin("variants.prices", "ma")
              .andWhere("ma.price_list_id IN (:...price_list_ids)", {
                price_list_ids: price_lists.value,
              })
          }
        )
      }

      if (optionsWithoutRelations?.where?.discount_condition_id) {
        const discount_condition_id =
          optionsWithoutRelations?.where?.discount_condition_id
        delete optionsWithoutRelations?.where?.discount_condition_id

        customJoinsBuilders.push(
          (qb: SelectQueryBuilder<Product>, alias: string) => {
            qb.innerJoin(
              "discount_condition_product",
              "dc_product",
              `dc_product.product_id = ${alias}.id AND dc_product.condition_id = :dcId`,
              { dcId: discount_condition_id }
            )
          }
        )
      }

      if (optionsWithoutRelations?.where?.sales_channel_id) {
        const sales_channels = optionsWithoutRelations?.where?.sales_channel_id
        delete optionsWithoutRelations?.where?.sales_channel_id

        customJoinsBuilders.push(
          (qb: SelectQueryBuilder<Product>, alias: string) => {
            qb.innerJoin(
              `${alias}.sales_channels`,
              "sales_channels",
              "sales_channels.id IN (:...sales_channels_ids)",
              { sales_channels_ids: sales_channels.value }
            )
          }
        )
      }

      const result = await queryEntityWithoutRelations<Product>(
        this,
        optionsWithoutRelations!,
        true,
        customJoinsBuilders
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
        optionsWithoutRelations
      )
      return [toReturn, toReturn.length]
    }

    const groupedRelations = getGroupedRelations(relations)
    const entitiesIdsWithRelations = await queryEntityWithIds(
      this,
      entitiesIds,
      groupedRelations,
      optionsWithoutRelations?.withDeleted ?? withDeleted,
      optionsWithoutRelations?.select ?? [],
      [
        (qb, alias, toplevel) => {
          const useCustomJoin = toplevel === "variants"
          if (useCustomJoin) {
            qb.leftJoinAndSelect(
              `${alias}.${toplevel}`,
              toplevel,
              "variants.deleted_at IS NULL"
            ).orderBy({
              "variants.variant_rank": "ASC",
            })
          }
          return !useCustomJoin
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
    const [products] = await this.findWithRelationsAndCount(
      relations,
      idsOrOptionsWithoutRelations,
      withDeleted
    )
    return products
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
