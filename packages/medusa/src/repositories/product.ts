import { flatten, groupBy, map, merge } from "lodash"
import {
  Brackets,
  FindOperator,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ILike,
  In,
} from "typeorm"
import { PriceList, Product, SalesChannel } from "../models"
import {
  ExtendedFindConfig,
  Selector,
  WithRequiredProperty,
} from "../types/common"
import { applyOrdering } from "../utils/repository"
import { buildLegacyFieldsListFrom } from "../utils"
import { dataSource } from "../loaders/database"

export type ProductSelector = Omit<Selector<Product>, "tags"> & {
  tags: FindOperator<string[]>
}

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<Product>,
  "relations"
>

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  order?: Record<string, "ASC" | "DESC">
  where: DefaultWithoutRelations["where"] & {
    price_list_id?: FindOperator<PriceList>
    sales_channel_id?: FindOperator<SalesChannel>
    discount_condition_id?: string
  }
}

export const ProductRepository = dataSource.getRepository(Product).extend({
  mergeEntitiesWithRelations(
    entitiesAndRelations: Array<Partial<Product>>
  ): Product[] {
    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
    return map(entitiesAndRelationsById, (entityAndRelations) =>
      merge({}, ...entityAndRelations)
    )
  },

  async queryProducts(
    optionsWithoutRelations: FindWithoutRelationsOptions,
    shouldCount = false
  ): Promise<[Product[], number]> {
    const productAlias = "product"

    optionsWithoutRelations.where = (optionsWithoutRelations?.where ??
      {}) as FindOptionsWhere<Product>

    const tags = optionsWithoutRelations?.where?.tags
    delete optionsWithoutRelations?.where?.tags

    const price_lists = optionsWithoutRelations?.where?.price_list_id
    delete optionsWithoutRelations?.where?.price_list_id

    const sales_channels = optionsWithoutRelations?.where?.sales_channel_id
    delete optionsWithoutRelations?.where?.sales_channel_id

    const discount_condition_id =
      optionsWithoutRelations?.where?.discount_condition_id
    delete optionsWithoutRelations?.where?.discount_condition_id

    const qb = this.createQueryBuilder(productAlias)
      .select([`${productAlias}.id`])
      .skip(optionsWithoutRelations.skip)
      .take(optionsWithoutRelations.take)

    if (optionsWithoutRelations.where) {
      qb.where(optionsWithoutRelations.where)
    }

    if (tags) {
      qb.leftJoin(`${productAlias}.tags`, "tags").andWhere(
        `tags.id IN (:...tag_ids)`,
        {
          tag_ids: (tags as FindOperator<number[]>).value,
        }
      )
    }

    if (price_lists) {
      qb.leftJoin(`${productAlias}.variants`, "variants")
        .leftJoin("variants.prices", "prices")
        .andWhere("prices.price_list_id IN (:...price_list_ids)", {
          price_list_ids: price_lists.value,
        })
    }

    if (sales_channels) {
      qb.innerJoin(
        `${productAlias}.sales_channels`,
        "sales_channels",
        "sales_channels.id IN (:...sales_channels_ids)",
        { sales_channels_ids: sales_channels.value }
      )
    }

    if (discount_condition_id) {
      qb.innerJoin(
        "discount_condition_product",
        "dc_product",
        `dc_product.product_id = ${productAlias}.id AND dc_product.condition_id = :dcId`,
        { dcId: discount_condition_id }
      )
    }

    const joinedWithPriceLists = !!price_lists
    applyOrdering({
      repository: this,
      order: optionsWithoutRelations.order ?? {},
      qb,
      alias: productAlias,
      shouldJoin: (relation) => relation !== "prices" || !joinedWithPriceLists,
    })

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
  },

  getGroupedRelations(relations: string[]): {
    [toplevel: string]: string[]
  } {
    const groupedRelations: { [toplevel: string]: string[] } = {}
    for (const rel of relations) {
      const [topLevel] = rel.split(".")
      if (groupedRelations[topLevel]) {
        groupedRelations[topLevel].push(rel)
      } else {
        groupedRelations[topLevel] = [rel]
      }
    }

    return groupedRelations
  },

  async queryProductsWithIds(
    entityIds: string[],
    groupedRelations: { [toplevel: string]: string[] },
    withDeleted = false,
    select: FindOptionsSelect<Product> = {},
    order: { [column: string]: "ASC" | "DESC" } = {}
  ): Promise<Product[]> {
    const entitiesIdsWithRelations = await Promise.all(
      Object.entries(groupedRelations).map(async ([toplevel, rels]) => {
        let querybuilder = this.createQueryBuilder("products")

        const legacySelect = buildLegacyFieldsListFrom(select)

        if (legacySelect?.length) {
          querybuilder.select(legacySelect.map((f) => `products.${f}`))
        }

        if (toplevel === "variants") {
          querybuilder = querybuilder.leftJoinAndSelect(
            `products.${toplevel}`,
            toplevel,
            "variants.deleted_at IS NULL"
          )

          order["variants.variant_rank"] = "ASC"
        } else {
          querybuilder = querybuilder.leftJoinAndSelect(
            `products.${toplevel}`,
            toplevel
          )
        }

        for (const rel of rels) {
          const [_, rest] = rel.split(".")
          if (!rest) {
            continue
          }
          // Regex matches all '.' except the rightmost
          querybuilder = querybuilder.leftJoinAndSelect(
            rel.replace(/\.(?=[^.]*\.)/g, "__"),
            rel.replace(".", "__")
          )
        }

        if (withDeleted) {
          querybuilder = querybuilder
            .where("products.id IN (:...entitiesIds)", {
              entitiesIds: entityIds,
            })
            .withDeleted()
        } else {
          querybuilder = querybuilder.where(
            "products.deleted_at IS NULL AND products.id IN (:...entitiesIds)",
            {
              entitiesIds: entityIds,
            }
          )
        }

        return querybuilder.getMany()
      })
    ).then(flatten)

    return entitiesIdsWithRelations
  },

  async findWithRelationsAndCount(
    relations: FindOptionsRelations<Product> = {},
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
  ): Promise<[Product[], number]> {
    let count: number
    let entities: Product[]
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.find({
        where: { id: In(idsOrOptionsWithoutRelations) },
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

    if (Object.keys(relations).length === 0) {
      const options = { ...idsOrOptionsWithoutRelations }

      // Since we are finding by the ids that have been retrieved above and those ids are already
      // applying skip/take. Remove those options to avoid getting no results
      delete options.skip
      delete options.take

      const toReturn = await this.find({
        ...options,
        where: { id: In(entitiesIds) },
      })
      return [toReturn, toReturn.length]
    }

    const legacyRelations = buildLegacyFieldsListFrom(relations)
    const groupedRelations = this.getGroupedRelations(legacyRelations)
    const entitiesIdsWithRelations = await this.queryProductsWithIds(
      entitiesIds,
      groupedRelations,
      idsOrOptionsWithoutRelations.withDeleted,
      idsOrOptionsWithoutRelations.select,
      idsOrOptionsWithoutRelations.order
    )

    const entitiesAndRelations = groupBy(entitiesIdsWithRelations, "id")
    const entitiesToReturn = map(entitiesIds, (id) =>
      merge({}, ...entitiesAndRelations[id])
    )

    return [entitiesToReturn, count]
  },

  async findWithRelations(
    relations: FindOptionsRelations<Product> = {},
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions | string[] = {
      where: {},
    },
    withDeleted = false
  ): Promise<Product[]> {
    let entities: Product[]
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.find({
        where: { id: In(idsOrOptionsWithoutRelations) },
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
      Object.keys(relations).length === 0 &&
      !Array.isArray(idsOrOptionsWithoutRelations)
    ) {
      return await this.find({
        ...idsOrOptionsWithoutRelations,
        where: { id: In(entitiesIds) },
      })
    }

    const legacyRelations = buildLegacyFieldsListFrom(relations)
    const groupedRelations = this.getGroupedRelations(legacyRelations)
    const entitiesIdsWithRelations = await this.queryProductsWithIds(
      entitiesIds,
      groupedRelations,
      withDeleted
    )

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
    const entitiesToReturn =
      this.mergeEntitiesWithRelations(entitiesAndRelations)

    return entitiesToReturn
  },

  async findOneWithRelations(
    relations: FindOptionsRelations<Product> = {},
    optionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
  ): Promise<Product> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  },

  async bulkAddToCollection(
    productIds: string[],
    collectionId: string
  ): Promise<Product[]> {
    await this.createQueryBuilder()
      .update(Product)
      .set({ collection_id: collectionId })
      .where({ id: In(productIds) })
      .execute()

    return this.findByIds(productIds)
  },

  async bulkRemoveFromCollection(
    productIds: string[],
    collectionId: string
  ): Promise<Product[]> {
    await this.createQueryBuilder()
      .update(Product)
      .set({ collection_id: null })
      .where({ id: In(productIds), collection_id: collectionId })
      .execute()

    return this.findByIds(productIds)
  },

  async getFreeTextSearchResultsAndCount(
    q: string,
    options: FindWithoutRelationsOptions = { where: {} },
    relations: FindOptionsRelations<Product> = {}
  ): Promise<[Product[], number]> {
    const productAlias = "product"
    const pricesAlias = "prices"
    const variantsAlias = "variants"
    const collectionAlias = "collection"
    const tagsAlias = "tags"

    options.where = options.where as FindOptionsWhere<Product>

    const tags = options.where.tags
    delete options.where.tags

    const price_lists = options.where.price_list_id
    delete options.where.price_list_id

    const sales_channels = options.where.sales_channel_id
    delete options.where.sales_channel_id

    const discount_condition_id = options.where.discount_condition_id
    delete options.where.discount_condition_id

    const cleanedOptions = this._cleanOptions(options)

    let qb = this.createQueryBuilder(`${productAlias}`)
      .leftJoinAndSelect(`${productAlias}.variants`, variantsAlias)
      .leftJoinAndSelect(`${productAlias}.collection`, `${collectionAlias}`)
      .select([`${productAlias}.id`])
      .where(cleanedOptions.where)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`${productAlias}.description ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${productAlias}.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${variantsAlias}.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${variantsAlias}.sku ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${collectionAlias}.title ILIKE :q`, { q: `%${q}%` })
        })
      )
      .skip(cleanedOptions.skip)
      .take(cleanedOptions.take)

    if (discount_condition_id) {
      qb.innerJoin(
        "discount_condition_product",
        "dc_product",
        `dc_product.product_id = ${productAlias}.id AND dc_product.condition_id = :dcId`,
        { dcId: discount_condition_id }
      )
    }

    if (tags) {
      qb.leftJoin(`${productAlias}.tags`, tagsAlias).andWhere(
        `${tagsAlias}.id IN (:...tag_ids)`,
        {
          tag_ids: (tags as FindOperator<number[]>).value,
        }
      )
    }

    if (price_lists) {
      const variantPricesAlias = `${variantsAlias}_prices`
      qb.leftJoin(`${productAlias}.variants`, variantPricesAlias)
        .leftJoin(`${variantPricesAlias}.prices`, pricesAlias)
        .andWhere(`${pricesAlias}.price_list_id IN (:...price_list_ids)`, {
          price_list_ids: price_lists.value,
        })
    }

    if (sales_channels) {
      qb.innerJoin(
        `${productAlias}.sales_channels`,
        "sales_channels",
        "sales_channels.id IN (:...sales_channels_ids)",
        { sales_channels_ids: sales_channels.value }
      )
    }

    const joinedWithTags = !!tags
    const joinedWithPriceLists = !!price_lists
    applyOrdering({
      repository: this,
      order: options.order ?? {},
      qb,
      alias: productAlias,
      shouldJoin: (relation) =>
        relation !== variantsAlias &&
        (relation !== pricesAlias || !joinedWithPriceLists) &&
        (relation !== tagsAlias || !joinedWithTags),
    })

    if (cleanedOptions.withDeleted) {
      qb = qb.withDeleted()
    }

    const [results, count] = await qb.getManyAndCount()
    const orderedResultsSet = new Set(results.map((p) => p.id))

    const products = await this.findWithRelations(
      relations,
      [...orderedResultsSet],
      cleanedOptions.withDeleted
    )
    const productsMap = new Map(products.map((p) => [p.id, p]))

    // Looping through the orderedResultsSet in order to maintain the original order and assign the data returned by findWithRelations
    const orderedProducts: Product[] = []
    orderedResultsSet.forEach((id) => {
      orderedProducts.push(productsMap.get(id)!)
    })

    return [orderedProducts, count]
  },

  async isProductInSalesChannels(
    id: string,
    salesChannelIds: string[]
  ): Promise<boolean> {
    return (
      (await this.createQueryBuilder("product")
        .leftJoin(
          "product.sales_channels",
          "sales_channels",
          "sales_channels.id IN (:...salesChannelIds)",
          { salesChannelIds }
        )
        .getCount()) > 0
    )
  },

  _cleanOptions(
    options: FindWithoutRelationsOptions
  ): WithRequiredProperty<FindWithoutRelationsOptions, "where"> {
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
  },

  async findAndCount(
    options: ExtendedFindConfig<
      Product & {
        price_list_id?: FindOperator<PriceList>
        sales_channel_id?: FindOperator<SalesChannel>
        discount_condition_id?: string
      }
    >,
    q?: string
  ): Promise<[Product[], number]> {
    const productAlias = "product"
    const queryBuilder = this.createQueryBuilder(productAlias)
    // TODO: https://github.com/typeorm/typeorm/issues/9719 waiting an answer before being able to set it to `query`
    // Therefore use query when there is only an ordering by the product entity otherwise fallback to join
    queryBuilder.expressionMap.relationLoadStrategy = "join"

    const options_ = { ...options }

    options_.relations = options_.relations ?? {}
    options_.where = options_.where as FindOptionsWhere<Product>

    if (options_.where.price_list_id) {
      options_.relations.variants = {
        prices: true,
      }

      const priceListIds = options_.where.price_list_id as FindOperator<
        string[]
      >
      delete options_.where.price_list_id

      options_.where.variants = options_.where.variants ?? {}
      options_.where.variants["prices"] = {
        price_list_id: In(priceListIds.value) as any,
      }
    }

    if (options_.where.tags) {
      const tagIds = (options_.where.tags as FindOperator<string[]>).value
      const joinMethod = options_.relations.tags
        ? queryBuilder.leftJoinAndSelect.bind(queryBuilder)
        : queryBuilder.leftJoin.bind(queryBuilder)

      // For an unknown reason, the implementation of the SelectQueryBuilder.setFindOptions -> buildWhere
      // Only check if it is a find operator MoreThan or LessThan. Otherwise, it has to be a relation of
      // isManyToOne or isOneToOne in order to be valid. Otherwise, it throws `This relation isn't supported by given find operator`
      // We might need to wait for an update or open a PR around that subject

      joinMethod(`${productAlias}.tags`, "tags").andWhere(
        `tags.id IN (:...tag_ids)`,
        {
          tag_ids: tagIds,
        }
      )

      /* if (typeof options_.relations.tags === "boolean") {
        delete options_.relations.tags
      }*/

      delete options_.where.tags
    }

    if (options_.where.sales_channels) {
      const joinMethod = options_.relations.sales_channels
        ? queryBuilder.leftJoinAndSelect.bind(queryBuilder)
        : queryBuilder.leftJoin.bind(queryBuilder)

      // For an unknown reason, the implementation of the SelectQueryBuilder.setFindOptions -> buildWhere
      // Only check if it is a find operator MoreThan or LessThan. Otherwise, it has to be a relation of
      // isManyToOne or isOneToOne in order to be valid. Otherwise, it throws `This relation isn't supported by given find operator`
      // We might need to wait for an update or open a PR around that subject

      joinMethod(
        `${productAlias}.sales_channels`,
        "sales_channels",
        "sales_channels.id IN (:...sales_channels_ids)",
        {
          sales_channels_ids: (
            options_.where.sales_channels as FindOperator<string[]>
          ).value,
        }
      )

      /* if (typeof options_.relations.sales_channels === "boolean") {
        delete options_.relations.sales_channels
      }*/

      delete options_.where.sales_channels
    }

    if (options_.where.discount_condition_id) {
      queryBuilder.innerJoin(
        "discount_condition_product",
        "dc_product",
        `dc_product.product_id = product.id AND dc_product.condition_id = :dcId`,
        { dcId: options_.where.discount_condition_id }
      )

      delete options_.where.discount_condition_id
    }

    if (q) {
      options_.relations = options_.relations ?? {}
      options_.relations.variants = options_.relations.variants ?? true
      options_.relations.collection = options_.relations.collection ?? true

      options_.where = [
        {
          ...options_.where,
          description: ILike(`%${q}%`),
        },
        {
          ...options_.where,
          title: ILike(`%${q}%`),
        },
        {
          ...options_.where,
          variants: {
            title: ILike(`%${q}%`),
          },
        },
        {
          ...options_.where,
          variants: {
            sku: ILike(`%${q}%`),
          },
        },
        {
          ...options_.where,
          collection: {
            title: ILike(`%${q}%`),
          },
        },
      ]
    }

    if (options_.withDeleted) {
      queryBuilder.withDeleted()
    }

    const res = await queryBuilder.setFindOptions(options_).getManyAndCount()
    return res
  },
})
export default ProductRepository
