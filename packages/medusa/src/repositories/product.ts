import { flatten, groupBy, map, merge } from "lodash"
import {
  Brackets,
  EntityRepository,
  FindOperator,
  In,
  Repository,
} from "typeorm"
import { PriceList, Product, ProductCategory, SalesChannel } from "../models"
import {
  ExtendedFindConfig,
  Selector,
  WithRequiredProperty,
} from "../types/common"
import { applyOrdering } from "../utils/repository"

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
    category_id?: {
      value: string[]
    }
    include_category_children?: boolean
    discount_condition_id?: string
  }
}

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  private mergeEntitiesWithRelations(
    entitiesAndRelations: Array<Partial<Product>>
  ): Product[] {
    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
    return map(entitiesAndRelationsById, (entityAndRelations) =>
      merge({}, ...entityAndRelations)
    )
  }

  private async queryProducts(
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

    const categories = optionsWithoutRelations?.where?.category_id
    delete optionsWithoutRelations?.where?.category_id

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

    if (categories) {
      let categoryIds = categories.value

      if (include_category_children) {
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

      if (categoryIds.length) {
        qb.innerJoin(
          `${productAlias}.categories`,
          "categories",
          "categories.id IN (:...categoryIds)",
          { categoryIds }
        )
      }
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
  }

  private getGroupedRelations(relations: string[]): {
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
  }

  private async queryProductsWithIds(
    entityIds: string[],
    groupedRelations: { [toplevel: string]: string[] },
    withDeleted = false,
    select: (keyof Product)[] = [],
    order: { [column: string]: "ASC" | "DESC" } = {}
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
      const options = { ...idsOrOptionsWithoutRelations }

      // Since we are finding by the ids that have been retrieved above and those ids are already
      // applying skip/take. Remove those options to avoid getting no results
      delete options.skip
      delete options.take

      const toReturn = await this.findByIds(entitiesIds, options)
      return [toReturn, toReturn.length]
    }

    const groupedRelations = this.getGroupedRelations(relations)
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

    const groupedRelations = this.getGroupedRelations(relations)
    const entitiesIdsWithRelations = await this.queryProductsWithIds(
      entitiesIds,
      groupedRelations,
      withDeleted
    )

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
    const entitiesToReturn =
      this.mergeEntitiesWithRelations(entitiesAndRelations)

    return entitiesToReturn
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
  }

  public async isProductInSalesChannels(
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
  }

  /**
   * Upserts shipping profile for products
   * @param productIds IDs of products to update
   * @param shippingProfileId ID of shipping profile to assign to products
   * @returns updated products
   */
  public async upsertShippingProfile(
    productIds: string[],
    shippingProfileId: string
  ): Promise<Product[]> {
    await this.createQueryBuilder()
      .update(Product)
      .set({ profile_id: shippingProfileId })
      .where({ id: In(productIds) })
      .execute()

    return await this.findByIds(productIds)
  }

  private _cleanOptions(
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
  }
}
