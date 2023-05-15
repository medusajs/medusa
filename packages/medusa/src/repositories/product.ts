import {
  Brackets,
  FindOperator,
  FindOptionsWhere,
  In,
  SelectQueryBuilder,
} from "typeorm"
import {
  PriceList,
  Product,
  ProductCategory,
  ProductTag,
  SalesChannel,
} from "../models"
import { dataSource } from "../loaders/database"
import { cloneDeep, flatten, groupBy, map, merge } from "lodash"
import { ExtendedFindConfig, WithRequiredProperty } from "../types/common"
import {
  applyOrdering,
  getGroupedRelations,
  mergeEntitiesWithRelations,
} from "../utils/repository"
import { objectToStringPath } from "@medusajs/utils"

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<Product>,
  "relations"
>

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  where: DefaultWithoutRelations["where"] & {
    price_list_id?: FindOperator<PriceList>
    sales_channel_id?: FindOperator<SalesChannel>
    category_id?: {
      value: string[]
    }
    categories?: FindOptionsWhere<ProductCategory>
    tags?: FindOperator<ProductTag>
    include_category_children?: boolean
    discount_condition_id?: string
  }
}

export const ProductRepository = dataSource.getRepository(Product).extend({
  async queryProducts(
    optionsWithoutRelations: FindWithoutRelationsOptions,
    shouldCount = false
  ): Promise<[Product[], number]> {
    const productAlias = "product"

    const tags = optionsWithoutRelations?.where?.tags
    delete optionsWithoutRelations?.where?.tags

    const price_lists = optionsWithoutRelations?.where?.price_list_id
    delete optionsWithoutRelations?.where?.price_list_id

    const sales_channels = optionsWithoutRelations?.where?.sales_channel_id
    delete optionsWithoutRelations?.where?.sales_channel_id

    const categoryId = optionsWithoutRelations?.where?.category_id
    delete optionsWithoutRelations?.where?.category_id

    const categoriesQuery = optionsWithoutRelations.where.categories || {}
    delete optionsWithoutRelations?.where?.categories

    const include_category_children =
      optionsWithoutRelations?.where?.include_category_children
    delete optionsWithoutRelations?.where?.include_category_children

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
          tag_ids: tags.value,
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

    let categoryIds: string[] = []
    if (categoryId) {
      categoryIds = categoryId?.value

      if (include_category_children) {
        const categoryRepository =
          this.manager.getTreeRepository(ProductCategory)
        const categories = await categoryRepository.find({
          where: { id: In(categoryIds) },
        })

        for (const category of categories) {
          const categoryChildren = await categoryRepository.findDescendantsTree(
            category
          )

          const getAllIdsRecursively = (productCategory: ProductCategory) => {
            let result = [productCategory.id]

            ;(productCategory.category_children || []).forEach((child) => {
              result = result.concat(getAllIdsRecursively(child))
            })

            return result
          }

          categoryIds = categoryIds.concat(
            getAllIdsRecursively(categoryChildren)
          )
        }
      }
    }

    if (categoryIds.length || categoriesQuery) {
      const joinScope = {}

      if (categoryIds.length) {
        Object.assign(joinScope, { id: categoryIds })
      }

      if (categoriesQuery) {
        Object.assign(joinScope, categoriesQuery)
      }

      this._applyCategoriesQuery(qb, {
        alias: productAlias,
        categoryAlias: "categories",
        where: joinScope,
        joinName: "leftJoin",
      })
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
      order: (optionsWithoutRelations.order as any) ?? {},
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

  async queryProductsWithIds(
    entityIds: string[],
    groupedRelations: { [toplevel: string]: string[] },
    withDeleted = false,
    select: (keyof Product)[] = [],
    order: { [column: string]: "ASC" | "DESC" } = {},
    where: FindOptionsWhere<Product> = {}
  ): Promise<Product[]> {
    const entitiesIdsWithRelations = await Promise.all(
      Object.entries(groupedRelations).map(async ([toplevel, rels]) => {
        let querybuilder = this.createQueryBuilder("products")

        if (select && select.length) {
          querybuilder.select(select.map((f) => `products.${f}`))
        }

        if (toplevel === "variants") {
          querybuilder = querybuilder.leftJoinAndSelect(
            `products.${toplevel}`,
            toplevel,
            "variants.deleted_at IS NULL"
          )

          if (!Object.keys(order).some((key) => key.startsWith("variants"))) {
            // variant_rank being select false, apply the filter here directly
            querybuilder.addOrderBy(`${toplevel}.variant_rank`, "ASC")
          }
        } else if (toplevel === "categories") {
          const joinScope =
            where.categories as FindOptionsWhere<ProductCategory>

          querybuilder = this._applyCategoriesQuery(querybuilder, {
            alias: "products",
            categoryAlias: "categories",
            where: joinScope,
            joinName: "leftJoinAndSelect",
          })
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

          querybuilder = querybuilder.leftJoinAndSelect(
            // Regex matches all '.' except the rightmost
            rel.replace(/\.(?=[^.]*\.)/g, "__"),
            // Replace all '.' with '__' to avoid typeorm's automatic aliasing
            rel.replace(/\./g, "__")
          )
        }

        if (withDeleted) {
          querybuilder = querybuilder
            .andWhere("products.id IN (:...entitiesIds)", {
              entitiesIds: entityIds,
            })
            .withDeleted()
        } else {
          querybuilder = querybuilder.andWhere(
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
    relations: string[] = [],
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
  ): Promise<[Product[], number]> {
    const isOptionsArray = Array.isArray(idsOrOptionsWithoutRelations)
    const originalWhere = isOptionsArray
      ? undefined
      : cloneDeep(idsOrOptionsWithoutRelations.where)
    const originalOrder: any = isOptionsArray
      ? undefined
      : { ...idsOrOptionsWithoutRelations.order }
    const clonedOptions = isOptionsArray
      ? idsOrOptionsWithoutRelations
      : cloneDeep(idsOrOptionsWithoutRelations)

    let count: number
    let entities: Product[]

    if (isOptionsArray) {
      entities = await this.find({
        where: {
          id: In(clonedOptions as unknown as string[]),
        },
        withDeleted: clonedOptions.withDeleted ?? false,
      })
      count = entities.length
    } else {
      const result = await this.queryProducts(clonedOptions, true)
      entities = result[0]
      count = result[1]
    }
    const entitiesIds = entities.map(({ id }) => id)

    if (entitiesIds.length === 0) {
      // no need to continue
      return [[], count]
    }

    if (relations.length === 0) {
      // Since we are finding by the ids that have been retrieved above and those ids are already
      // applying skip/take. Remove those options to avoid getting no results
      delete clonedOptions.skip
      delete clonedOptions.take

      const toReturn = await this.find({
        ...(isOptionsArray
          ? {}
          : (clonedOptions as FindWithoutRelationsOptions)),
        where: {
          id: In(entitiesIds),
          ...(isOptionsArray ? {} : clonedOptions.where),
        },
      })
      return [toReturn, toReturn.length]
    }

    const groupedRelations = getGroupedRelations(relations)

    const entitiesIdsWithRelations = await this.queryProductsWithIds(
      entitiesIds,
      groupedRelations,
      idsOrOptionsWithoutRelations.withDeleted,
      isOptionsArray
        ? undefined
        : objectToStringPath(idsOrOptionsWithoutRelations.select),
      originalOrder,
      originalWhere
    )

    const entitiesAndRelations = groupBy(entitiesIdsWithRelations, "id")
    const entitiesToReturn = map(entitiesIds, (id) =>
      merge({}, ...entitiesAndRelations[id])
    )

    return [entitiesToReturn, count]
  },

  async findWithRelations(
    relations: string[] = [],
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions | string[] = {
      where: {},
    },
    withDeleted = false
  ): Promise<Product[]> {
    const isOptionsArray = Array.isArray(idsOrOptionsWithoutRelations)
    const originalWhere = isOptionsArray
      ? undefined
      : cloneDeep(idsOrOptionsWithoutRelations.where)
    const originalOrder: any = isOptionsArray
      ? undefined
      : { ...idsOrOptionsWithoutRelations.order }
    const clonedOptions = isOptionsArray
      ? idsOrOptionsWithoutRelations
      : cloneDeep(idsOrOptionsWithoutRelations)

    let entities: Product[]
    if (isOptionsArray) {
      entities = await this.find({
        where: { id: In(clonedOptions as string[]) },
        withDeleted,
      })
    } else {
      const result = await this.queryProducts(
        clonedOptions as FindWithoutRelationsOptions,
        false
      )
      entities = result[0]
    }
    const entitiesIds = entities.map(({ id }) => id)

    if (entitiesIds.length === 0) {
      // no need to continue
      return []
    }

    if (relations.length === 0) {
      return await this.find({
        ...(isOptionsArray
          ? {}
          : (clonedOptions as FindWithoutRelationsOptions)),
        where: {
          id: In(entitiesIds),
          ...(isOptionsArray
            ? {}
            : (clonedOptions as FindWithoutRelationsOptions).where),
        },
      })
    }

    const groupedRelations = getGroupedRelations(relations)
    const entitiesIdsWithRelations = await this.queryProductsWithIds(
      entitiesIds,
      groupedRelations,
      withDeleted,
      isOptionsArray
        ? undefined
        : objectToStringPath(idsOrOptionsWithoutRelations.select),
      originalOrder,
      originalWhere
    )

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    return mergeEntitiesWithRelations<Product>(entitiesAndRelations)
  },

  async findOneWithRelations(
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
    relations: string[] = []
  ): Promise<[Product[], number]> {
    const productAlias = "product"
    const pricesAlias = "prices"
    const variantsAlias = "variants"
    const collectionAlias = "collection"
    const tagsAlias = "tags"

    const tags = options.where.tags
    delete options.where.tags

    const price_lists = options.where.price_list_id
    delete options.where.price_list_id

    const sales_channels = options.where.sales_channel_id
    delete options.where.sales_channel_id

    const discount_condition_id = options.where.discount_condition_id
    delete options.where.discount_condition_id

    const categoriesQuery = options.where.categories
    delete options.where.categories

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
          tag_ids: tags.value,
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

    if (categoriesQuery) {
      this._applyCategoriesQuery(qb, {
        alias: "products",
        categoryAlias: "categories",
        where: categoriesQuery,
        joinName: "leftJoin",
      })
    }

    const joinedWithTags = !!tags
    const joinedWithPriceLists = !!price_lists
    applyOrdering({
      repository: this,
      order: (options.order as any) ?? {},
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

  _applyCategoriesQuery(
    qb: SelectQueryBuilder<Product>,
    { alias, categoryAlias, where, joinName }
  ) {
    const joinWhere = Object.entries(where ?? {})
      .map(([column, condition]) => {
        if (Array.isArray(condition)) {
          return `${categoryAlias}.${column} IN (:...${column})`
        } else {
          return `${categoryAlias}.${column} = :${column}`
        }
      })
      .join(" AND ")

    qb[joinName](`${alias}.${categoryAlias}`, categoryAlias, joinWhere, where)

    return qb
  },

  /* async findAndCount(
    options: ExtendedFindConfig<Product & ProductFilterOptions>,
    q?: string
  ): Promise<[Product[], number]> {
    const options_ = { ...options }
    options_.relationLoadStrategy = "query"

    const queryBuilder = await this.prepareQueryBuilder_(options_, q)
    return await queryBuilder.getManyAndCount()
  },

  async findOne(
    options: ExtendedFindConfig<Product & ProductFilterOptions>
  ): Promise<Product | null> {
    const options_ = { ...options }
    options_.relationLoadStrategy = "query"

    const queryBuilder = await this.prepareQueryBuilder_(options_)
    return await queryBuilder.getOne()
  },

  async prepareQueryBuilder_(
    options: ExtendedFindConfig<Product & ProductFilterOptions>,
    q?: string
  ): Promise<SelectQueryBuilder<Product>> {
    const options_ = { ...options }

    const productAlias = "product"
    const queryBuilder = this.createQueryBuilder(productAlias)

    // TODO: https://github.com/typeorm/typeorm/issues/9719
    // https://github.com/typeorm/typeorm/issues/6294
    // Cleanup the repo and fix order/skip/take and relation load strategy when those issues are resolved

    const orderFieldsCollectionPointSeparated = objectToStringPath(
      options.order ?? {}
    )

    const isDepth1 = !orderFieldsCollectionPointSeparated.some(
      (field) => field.indexOf(".") !== -1
    )
    options_.relationLoadStrategy = isDepth1
      ? options_.relationLoadStrategy
      : "join"

    options_.relations = options_.relations ?? {}
    options_.where = options_.where as FindOptionsWhere<Product>

    const priceListId = options_.where.price_list_id as FindOperator<string[]>
    const tags = options_.where.tags as FindOperator<string[]>
    const salesChannelId = options_.where.sales_channel_id as FindOperator<
      string[]
    >
    const categoryId = options_.where.category_id as FindOperator<string[]>
    const discountConditionId = options_.where.discount_condition_id
    const categoriesQuery = (options_.where.categories ||
      {}) as FindOptionsWhere<ProductCategory>
    const includeCategoryChildren =
      options_.where.include_category_children ?? false

    delete options_.where.price_list_id
    delete options_.where.tags
    delete options_.where.sales_channel_id
    delete options_.where.category_id
    delete options_.where.discount_condition_id
    delete options_.where.include_category_children
    delete options_.where.categories

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

    // Add explicit ordering for variant ranking on the variants join directly
    // This constraint is applied if no other order is applied
    if (options_.relations.variants && !isObject(options_.order?.variants)) {
      queryBuilder.leftJoin(
        (subQueryBuilder) => {
          return subQueryBuilder
            .from(ProductVariant, "v")
            .orderBy("v.variant_rank", "ASC")
        },
        "variants",
        "product.id = variants.product_id"
      )
    }

    if (priceListId) {
      const priceListIds = priceListId.value

      queryBuilder
        .leftJoin(`${productAlias}.variants`, "variants_")
        .leftJoin("variants_.prices", "ma")
        .andWhere("ma.price_list_id IN (:...price_list_ids)", {
          price_list_ids: priceListIds,
        })
    }

    if (tags) {
      const joinMethod = options_.relations.tags
        ? queryBuilder.leftJoinAndSelect.bind(queryBuilder)
        : queryBuilder.leftJoin.bind(queryBuilder)

      const tagIds = tags.value

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
    }

    if (salesChannelId) {
      const joinMethod = options_.relations.sales_channels
        ? queryBuilder.innerJoinAndSelect.bind(queryBuilder)
        : queryBuilder.innerJoin.bind(queryBuilder)

      const scIds = salesChannelId.value

      joinMethod(
        `${productAlias}.sales_channels`,
        "sales_channels",
        "sales_channels.id IN (:...sales_channels_ids)",
        {
          sales_channels_ids: scIds,
        }
      )
    }

    if (categoryId) {
      const joinMethod = options_.relations.categories
        ? queryBuilder.innerJoinAndSelect.bind(queryBuilder)
        : queryBuilder.innerJoin.bind(queryBuilder)

      let categoryIds = categoryId.value

      if (includeCategoryChildren) {
        const categoryRepository =
          this.manager.getTreeRepository(ProductCategory)

        const categories = await categoryRepository.find({
          where: {
            id: In(categoryIds),
            ...categoriesQuery,
          },
        })

        for (const category of categories) {
          const categoryChildren = await categoryRepository.findDescendantsTree(
            category
          )

          categoryIds = categoryIds.concat(
            fetchCategoryDescendantsIds(categoryChildren, categoriesQuery)
          )
        }
      }

      if (categoryIds.length) {
        const categoryAlias = "categories"
        const joinScope = {
          ...categoriesQuery,
          id: categoryIds,
        }
        const joinWhere = Object.entries(joinScope)
          .map((entry) => {
            if (Array.isArray(entry[1])) {
              return `${categoryAlias}.${entry[0]} IN (:...${entry[0]})`
            } else {
              return `${categoryAlias}.${entry[0]} = :${entry[0]}`
            }
          })
          .join(" AND ")

        joinMethod(
          `${productAlias}.${categoryAlias}`,
          categoryAlias,
          joinWhere,
          joinScope
        )
      }
    }

    if (discountConditionId) {
      queryBuilder.innerJoin(
        "discount_condition_product",
        "dc_product",
        `dc_product.product_id = product.id AND dc_product.condition_id = :dcId`,
        { dcId: discountConditionId }
      )
    }

    if (options_.withDeleted) {
      queryBuilder.withDeleted()
    }

    queryBuilder.setFindOptions(options_)

    return queryBuilder
  },*/

  /**
   * Upserts shipping profile for products
   * @param productIds IDs of products to update
   * @param shippingProfileId ID of shipping profile to assign to products
   * @returns updated products
   */
  async upsertShippingProfile(
    productIds: string[],
    shippingProfileId: string
  ): Promise<Product[]> {
    await this.createQueryBuilder()
      .update(Product)
      .set({ profile_id: shippingProfileId })
      .where({ id: In(productIds) })
      .execute()

    return await this.findByIds(productIds)
  },
})

export default ProductRepository
