import {
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  SelectQueryBuilder,
} from "typeorm"
import { Product, ProductCategory } from "../models"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"
import { isObject } from "../utils"
import { ProductFilterOptions } from "../types/product"

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
    const queryBuilder = await this.prepareQueryBuilder_(options, q)
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

    // TODO: https://github.com/typeorm/typeorm/issues/9719 waiting an answer before being able to set it to `query`
    // Therefore use query when there is only an ordering by the product entity otherwise fallback to join.
    // In other word, if the order depth is more than 1 then use join otherwise use query
    /* const orderFieldsCollectionPointSeparated = buildLegacyFieldsListFrom(
      options.order ?? {}
    )
    const isDepth1 = !orderFieldsCollectionPointSeparated.some(
      (field) => field.indexOf(".") !== -1
    )
    options_.relationLoadStrategy = isDepth1 ? "query" : "join"*/
    options_.relationLoadStrategy = "join"

    options_.relations = options_.relations ?? {}
    options_.where = options_.where as FindOptionsWhere<Product>

    // Add explicit ordering for variant ranking on the variants join directly
    // The constraint if there is any will be applied by the options_
    if (options_.relations.variants && !isObject(options_.order?.variants)) {
      options_.order = options_.order ?? {}
      options_.order.variants = {
        variant_rank: "ASC",
      }
      /* // The query strategy, as explain at the top of the function, does not select the column from the separated query
      // It is not possible to order with that strategy at the moment and, we are waiting for an answer from the typeorm team
      options_.relationLoadStrategy = "join"
      queryBuilder.leftJoinAndSelect(`${productAlias}.variants`, "variants")

      options_.order = options_.order ?? {}

      if (!isObject(options_.order.variants)) {
        options_.order.variants = {
          variant_rank: "ASC",
        }
      }*/
    }

    if (options_.where.price_list_id) {
      /* options_.relations.variants = {
        ...(isObject(options_.relations.variants)
          ? options_.relations.variants
          : {}),
        prices: true,
      }

      const priceListIds = (
        options_.where.price_list_id as FindOperator<string[]>
      ).value
      delete options_.where.price_list_id

      options_.where.variants = {
        ...(isObject(options_.where.variants) ? options_.where.variants : {}),
        prices: [
          {
            price_list_id: In(priceListIds),
          },
        ],
      }*/
      const priceListIds = (
        options_.where.price_list_id as FindOperator<string[]>
      ).value
      delete options_.where.price_list_id

      queryBuilder
        .leftJoin(`${productAlias}.variants`, "variants")
        .leftJoin("variants.prices", "ma")
        .andWhere("ma.price_list_id IN (:...price_list_ids)", {
          price_list_ids: priceListIds,
        })
    }

    if (options_.where.tags) {
      const joinMethod = options_.relations.tags
        ? queryBuilder.leftJoinAndSelect.bind(queryBuilder)
        : queryBuilder.leftJoin.bind(queryBuilder)

      const tagIds = (options_.where.tags as FindOperator<string[]>).value

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

      delete options_.where.tags
    }

    if (options_.where.sales_channel_id) {
      const joinMethod = options_.relations.sales_channel_id
        ? queryBuilder.innerJoinAndSelect.bind(queryBuilder)
        : queryBuilder.innerJoin.bind(queryBuilder)

      const scIds = (options_.where.sales_channel_id as FindOperator<string[]>)
        .value

      // Same comment as in the tags if block above + inner join is only doable using the query builder and not the options

      joinMethod(
        `${productAlias}.sales_channels`,
        "sales_channels",
        "sales_channels.id IN (:...sales_channels_ids)",
        {
          sales_channels_ids: scIds,
        }
      )

      delete options_.where.sales_channel_id
    }

    if (options_.where.category_id) {
      const includeCategoryChildren =
        options_.where.include_category_children || false
      const joinMethod = options_.relations.category_id
        ? queryBuilder.innerJoinAndSelect.bind(queryBuilder)
        : queryBuilder.innerJoin.bind(queryBuilder)

      let categoryIds = (options_.where.category_id as FindOperator<string[]>)
        .value

      // Same comment as in the tags if block above + inner join is only doable using the query builder and not the options
      if (includeCategoryChildren) {
        const categoryRepository =
          this.manager.getTreeRepository(ProductCategory)
        const categories = await categoryRepository.find({
          where: { id: In(categoryIds) },
        })

        categoryIds = []
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

      joinMethod(
        `${productAlias}.categories`,
        "categories",
        "categories.id IN (:...categoryIds)",
        {
          categoryIds,
        }
      )

      delete options_.where.category_id
    }

    delete options_.where.include_category_children

    if (options_.where.discount_condition_id) {
      // inner join is only doable using the query builder and not the options

      queryBuilder.innerJoin(
        "discount_condition_product",
        "dc_product",
        `dc_product.product_id = product.id AND dc_product.condition_id = :dcId`,
        { dcId: options_.where.discount_condition_id }
      )

      delete options_.where.discount_condition_id
    }
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
