import { ExtendedFindConfig } from "@medusajs/types"
import { objectToStringPath } from "@medusajs/utils"
import { cloneDeep } from "lodash"
import { isDefined } from "medusa-core-utils"
import {
  Brackets,
  FindOperator,
  FindOptionsWhere,
  In,
  SelectQueryBuilder,
} from "typeorm"
import { dataSource } from "../loaders/database"
import {
  PriceList,
  Product,
  ProductCategory,
  ProductTag,
  SalesChannel,
} from "../models"
import {
  applyOrdering,
  getGroupedRelations,
  mergeEntitiesWithRelations,
  queryEntityWithIds,
  queryEntityWithoutRelations,
} from "../utils/repository"

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<Product>,
  "relations"
>

type CategoryQueryParams = {
  value: string[]
}

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  where: DefaultWithoutRelations["where"] & {
    price_list_id?: FindOperator<PriceList>
    sales_channel_id?: FindOperator<SalesChannel>
    category_id?: CategoryQueryParams
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

    const includeCategoryChildren =
      optionsWithoutRelations?.where?.include_category_children
    delete optionsWithoutRelations?.where?.include_category_children

    const discount_condition_id =
      optionsWithoutRelations?.where?.discount_condition_id
    delete optionsWithoutRelations?.where?.discount_condition_id

    return queryEntityWithoutRelations<Product>({
      repository: this,
      optionsWithoutRelations,
      shouldCount,
      customJoinBuilders: [
        async (qb, alias) => {
          if (tags) {
            qb.leftJoin(`${alias}.tags`, "tags").andWhere(
              `tags.id IN (:...tag_ids)`,
              {
                tag_ids: tags.value,
              }
            )
            return { relation: "tags", preventOrderJoin: true }
          }

          return
        },
        async (qb, alias) => {
          if (price_lists) {
            qb.leftJoin(`${alias}.variants`, "variants")
              .leftJoin("variants.prices", "prices")
              .andWhere("prices.price_list_id IN (:...price_list_ids)", {
                price_list_ids: price_lists.value,
              })
            return { relation: "prices", preventOrderJoin: true }
          }

          return
        },
        async (qb, alias) => {
          if (sales_channels) {
            qb.innerJoin(
              `${alias}.sales_channels`,
              "sales_channels",
              "sales_channels.id IN (:...sales_channels_ids)",
              { sales_channels_ids: sales_channels.value }
            )
            return { relation: "sales_channels", preventOrderJoin: true }
          }

          return
        },
        async (qb, alias) => {
          const categoryIds: string[] = await this.getCategoryIdsFromInput(
            categoryId,
            includeCategoryChildren
          )

          if (categoryIds.length || categoriesQuery) {
            const joinScope = {}

            if (categoryIds.length) {
              Object.assign(joinScope, { id: categoryIds })
            }

            if (categoriesQuery) {
              Object.assign(joinScope, categoriesQuery)
            }

            this._applyCategoriesQuery(qb, {
              alias,
              categoryAlias: "categories",
              where: joinScope,
              joinName: categoryIds.length ? "innerJoin" : "leftJoin",
            })

            return { relation: "categories", preventOrderJoin: true }
          }

          return
        },
        async (qb, alias) => {
          if (discount_condition_id) {
            qb.innerJoin(
              "discount_condition_product",
              "dc_product",
              `dc_product.product_id = ${alias}.id AND dc_product.condition_id = :dcId`,
              { dcId: discount_condition_id }
            )
          }

          return
        },
      ],
    })
  },

  async queryProductsWithIds({
    entityIds,
    groupedRelations,
    withDeleted = false,
    select = [],
    order = {},
    where = {},
  }: {
    entityIds: string[]
    groupedRelations: { [toplevel: string]: string[] }
    withDeleted?: boolean
    select?: (keyof Product)[]
    order?: { [column: string]: "ASC" | "DESC" }
    where?: FindOptionsWhere<Product>
  }): Promise<Product[]> {
    return await queryEntityWithIds({
      repository: this,
      entityIds,
      groupedRelations,
      withDeleted,
      select,
      customJoinBuilders: [
        (queryBuilder, alias, topLevel) => {
          if (topLevel === "variants") {
            const joinMethod = select.filter(
              (key) => !!key.match(/^variants\.\w+$/i)
            ).length
              ? "leftJoin"
              : "leftJoinAndSelect"

            queryBuilder[joinMethod](`${alias}.${topLevel}`, topLevel)

            if (
              !Object.keys(order!).some((key) => key.startsWith("variants"))
            ) {
              // variant_rank being select false, apply the filter here directly
              queryBuilder.addOrderBy(`${topLevel}.variant_rank`, "ASC")
            }

            return false
          }

          return
        },
        (queryBuilder, alias, topLevel) => {
          if (topLevel === "categories") {
            const joinScope = where!
              .categories as FindOptionsWhere<ProductCategory>

            this._applyCategoriesQuery(queryBuilder, {
              alias,
              categoryAlias: "categories",
              where: joinScope,
              joinName: "leftJoinAndSelect",
            })

            return false
          }

          return
        },
      ],
    })
  },

  async findWithRelationsAndCount(
    relations: string[] = [],
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
  ): Promise<[Product[], number]> {
    return await this._findWithRelations({
      relations,
      idsOrOptionsWithoutRelations,
      withDeleted: false,
      shouldCount: true,
    })
  },

  async findWithRelations(
    relations: string[] = [],
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions | string[] = {
      where: {},
    },
    withDeleted = false
  ): Promise<Product[]> {
    const [products] = await this._findWithRelations({
      relations,
      idsOrOptionsWithoutRelations,
      withDeleted,
      shouldCount: false,
    })

    return products
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
    const option_ = cloneDeep(options)

    const productAlias = "product"
    const pricesAlias = "prices"
    const variantsAlias = "variants"
    const collectionAlias = "collection"
    const tagsAlias = "tags"

    if ("description" in option_.where) {
      delete option_.where.description
    }

    if ("title" in option_.where) {
      delete option_.where.title
    }

    const tags = option_.where.tags
    delete option_.where.tags

    const price_lists = option_.where.price_list_id
    delete option_.where.price_list_id

    const sales_channels = option_.where.sales_channel_id
    delete option_.where.sales_channel_id

    const discount_condition_id = option_.where.discount_condition_id
    delete option_.where.discount_condition_id

    const categoryId = option_.where.category_id
    delete option_.where.category_id

    const includeCategoryChildren = option_?.where?.include_category_children
    delete option_?.where?.include_category_children

    const categoriesQuery = option_.where.categories || {}
    delete option_.where.categories

    let qb = this.createQueryBuilder(`${productAlias}`)
      .leftJoinAndSelect(`${productAlias}.variants`, variantsAlias)
      .leftJoinAndSelect(`${productAlias}.collection`, `${collectionAlias}`)
      .select([`${productAlias}.id`])
      .where(option_.where)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`${productAlias}.description ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${productAlias}.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${variantsAlias}.title ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${variantsAlias}.sku ILIKE :q`, { q: `%${q}%` })
            .orWhere(`${collectionAlias}.title ILIKE :q`, { q: `%${q}%` })
        })
      )
      .skip(option_.skip)
      .take(option_.take)

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
      const joinScope = {}
      const categoryIds: string[] = await this.getCategoryIdsFromInput(
        categoryId,
        includeCategoryChildren
      )

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
        joinName: categoryIds.length ? "innerJoin" : "leftJoin",
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

    if (option_.withDeleted) {
      qb = qb.withDeleted()
    }

    const [results, count] = await qb.getManyAndCount()
    const orderedResultsSet = new Set(results.map((p) => p.id))

    const products = await this.findWithRelations(
      relations,
      [...orderedResultsSet],
      option_.withDeleted
    )
    const productsMap = new Map(products.map((p) => [p.id, p]))

    // Looping through the orderedResultsSet in order to maintain the original order and assign the data returned by findWithRelations
    const orderedProducts: Product[] = []
    orderedResultsSet.forEach((id) => {
      orderedProducts.push(productsMap.get(id)!)
    })

    return [orderedProducts, count]
  },

  async getCategoryIdsFromInput(
    categoryId?: CategoryQueryParams,
    includeCategoryChildren = false
  ): Promise<string[]> {
    let categoryIds = categoryId?.value

    if (!isDefined(categoryIds)) {
      return []
    }

    if (includeCategoryChildren) {
      const categoryRepository = this.manager.getTreeRepository(ProductCategory)
      const categories = await categoryRepository.find({
        where: { id: In(categoryIds) },
      })

      for (const category of categories) {
        const categoryChildren = await categoryRepository.findDescendantsTree(
          category
        )

        categoryIds = categoryIds.concat(
          this.getCategoryIdsRecursively(categoryChildren)
        )
      }
    }

    return categoryIds
  },

  getCategoryIdsRecursively(productCategory: ProductCategory) {
    let result = [productCategory.id]

    ;(productCategory.category_children || []).forEach((child) => {
      result = result.concat(this.getCategoryIdsRecursively(child))
    })

    return result
  },

  async _findWithRelations({
    relations = [],
    idsOrOptionsWithoutRelations = {
      where: {},
    },
    withDeleted = false,
    shouldCount = false,
  }: {
    relations: string[]
    idsOrOptionsWithoutRelations: string[] | FindWithoutRelationsOptions
    withDeleted: boolean
    shouldCount: boolean
  }): Promise<[Product[], number]> {
    withDeleted = Array.isArray(idsOrOptionsWithoutRelations)
      ? withDeleted
      : idsOrOptionsWithoutRelations.withDeleted ?? false
    const isOptionsArray = Array.isArray(idsOrOptionsWithoutRelations)
    const originalWhere = isOptionsArray
      ? undefined
      : cloneDeep(idsOrOptionsWithoutRelations.where)
    const originalOrder: any = isOptionsArray
      ? undefined
      : { ...idsOrOptionsWithoutRelations.order }
    const originalSelect = isOptionsArray
      ? undefined
      : (objectToStringPath(idsOrOptionsWithoutRelations.select, {
          includeParentPropertyFields: false,
        }) as (keyof Product)[])
    const clonedOptions = isOptionsArray
      ? idsOrOptionsWithoutRelations
      : cloneDeep(idsOrOptionsWithoutRelations)

    let count: number
    let entities: Product[]

    if (isOptionsArray) {
      entities = await this.find({
        where: {
          id: In(clonedOptions as string[]),
        },
        withDeleted,
      })
      count = entities.length
    } else {
      const result = await this.queryProducts(
        clonedOptions as FindWithoutRelationsOptions,
        shouldCount
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
      // Since we are finding by the ids that have been retrieved above and those ids are already
      // applying skip/take. Remove those options to avoid getting no results
      if (!Array.isArray(clonedOptions)) {
        delete clonedOptions.skip
        delete clonedOptions.take
      }

      const toReturn = await this.find({
        ...(isOptionsArray
          ? {}
          : (clonedOptions as FindWithoutRelationsOptions)),
        where: {
          id: In(entitiesIds),
          ...(Array.isArray(clonedOptions) ? {} : clonedOptions.where),
        },
      })
      return [toReturn, toReturn.length]
    }

    const groupedRelations = getGroupedRelations(relations)

    const entitiesIdsWithRelations = await this.queryProductsWithIds({
      entityIds: entitiesIds,
      groupedRelations,
      select: originalSelect,
      order: originalOrder,
      where: originalWhere,
      withDeleted,
    })

    const entitiesAndRelations = entities.concat(entitiesIdsWithRelations)
    const entitiesToReturn =
      mergeEntitiesWithRelations<Product>(entitiesAndRelations)

    return [entitiesToReturn, count]
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
})

export default ProductRepository
