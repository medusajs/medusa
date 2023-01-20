import { FindOperator, FindOptionsWhere, ILike, In } from "typeorm"
import { PriceList, Product, SalesChannel } from "../models"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"
import { buildLegacyFieldsListFrom, isObject } from "../utils"

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
    // Therefore use query when there is only an ordering by the product entity otherwise fallback to join.
    // In other word, if the order depth is more than 1 then use join otherwise use query
    const orderFieldsCollectionPointSeparated = buildLegacyFieldsListFrom(
      options.order ?? {}
    )
    const isDepth1 = !orderFieldsCollectionPointSeparated.some(
      (field) => field.indexOf(".") !== -1
    )
    queryBuilder.expressionMap.relationLoadStrategy = isDepth1
      ? "query"
      : "join"

    const options_ = { ...options }

    options_.relations = options_.relations ?? {}
    options_.where = options_.where as FindOptionsWhere<Product>

    if (options_.where.price_list_id) {
      options_.relations.variants = {
        ...(typeof options_.relations.variants === "object"
          ? options_.relations.variants
          : {}),
        prices: true,
      }

      const priceListIds = (
        options_.where.price_list_id as FindOperator<string[]>
      ).value
      delete options_.where.price_list_id

      options_.where.variants = options_.where.variants ?? {}
      options_.where.variants["prices"] = {
        price_list_id: In(priceListIds),
      }
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

      // Same comment as in the tags if block above

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

    if (options_.where.discount_condition_id) {
      queryBuilder.innerJoin(
        "discount_condition_product",
        "dc_product",
        `dc_product.product_id = product.id AND dc_product.condition_id = :dcId`,
        { dcId: options_.where.discount_condition_id }
      )

      delete options_.where.discount_condition_id
    }

    // Add explicit ordering for variant ranking on the variants join directly
    // The constraint if there is any will be applied by the options_
    if (options_.relations.variants) {
      // The query strategy, as explain at the top of the function, does not select the column from the separated query
      // It is not possible to order with that strategy at the moment and, we are waiting for an answer from the typeorm team
      queryBuilder.expressionMap.relationLoadStrategy = "join"
      queryBuilder.leftJoinAndSelect(`${productAlias}.variants`, "variants")

      options_.order = options_.order ?? {}

      delete options_.order.variants?.variant_rank
      options_.order.variants = {
        variant_rank: "ASC",
        ...(isObject(options_.order.variants) ? options_.order.variants : {}),
      }
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

    return await queryBuilder.setFindOptions(options_).getManyAndCount()
  },
})
export default ProductRepository
