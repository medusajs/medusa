import { flatten, groupBy, map, merge } from "lodash"
import {
  Brackets,
  EntityRepository,
  FindOperator,
  In,
  Repository,
} from "typeorm"
import { PriceList,
  Product,
  SalesChannel
} from "../models"
import {
  ExtendedFindConfig,
  Selector,
  WithRequiredProperty,
} from "../types/common"

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
    const tags = optionsWithoutRelations?.where?.tags
    delete optionsWithoutRelations?.where?.tags

    const price_lists = optionsWithoutRelations?.where?.price_list_id
    delete optionsWithoutRelations?.where?.price_list_id

    const sales_channels = optionsWithoutRelations?.where?.sales_channel_id
    delete optionsWithoutRelations?.where?.sales_channel_id

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
    select: (keyof Product)[] = []
  ): Promise<Product[]> {
    const entitiesIdsWithRelations = await Promise.all(
      Object.entries(groupedRelations).map(([toplevel, rels]) => {
        let querybuilder = this.createQueryBuilder("products")

        if (select && select.length) {
          querybuilder.select(select.map((f) => `products.${f}`))
        }

        if (toplevel === "variants") {
          querybuilder = querybuilder
            .leftJoinAndSelect(
              `products.${toplevel}`,
              toplevel,
              "variants.deleted_at IS NULL"
            )
            .orderBy({
              "variants.variant_rank": "ASC",
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
      const toReturn = await this.findByIds(
        entitiesIds,
        idsOrOptionsWithoutRelations
      )
      return [toReturn, toReturn.length]
    }

    const groupedRelations = this.getGroupedRelations(relations)
    const entitiesIdsWithRelations = await this.queryProductsWithIds(
      entitiesIds,
      groupedRelations,
      idsOrOptionsWithoutRelations.withDeleted,
      idsOrOptionsWithoutRelations.select
    )

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
    const entitiesToReturn =
      this.mergeEntitiesWithRelations(entitiesAndRelations)

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
    const cleanedOptions = this._cleanOptions(options)

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

    return {
      ...options,
      where,
    }
  }
}
