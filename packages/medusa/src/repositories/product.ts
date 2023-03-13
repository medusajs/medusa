import {
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  SelectQueryBuilder,
} from "typeorm"
import { Product, ProductCategory, ProductVariant } from "../models"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"
import { ProductFilterOptions } from "../types/product"
import {
  buildLegacyFieldsListFrom,
  isObject,
  fetchCategoryDescendantsIds,
} from "../utils"

export const ProductRepository = dataSource.getRepository(Product).extend({
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

  async findAndCount(
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
    const queryBuilder = await this.prepareQueryBuilder_(options)
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

    const orderFieldsCollectionPointSeparated = buildLegacyFieldsListFrom(
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

    // TODO: move back to the service layer
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
  },

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
