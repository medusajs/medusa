import { flatten, groupBy, map, merge } from "lodash"
import {
  EntityRepository,
  FindManyOptions,
  OrderByCondition,
  Repository,
  SelectQueryBuilder,
} from "typeorm"
import { ProductCollection } from "../models/product-collection"

type DefaultWithoutRelations = Omit<
  FindManyOptions<ProductCollection>,
  "relations"
>

type CustomOptions = {
  where?: DefaultWithoutRelations["where"]
  order?: OrderByCondition
  skip?: number
  take?: number
}

@EntityRepository(ProductCollection)
export class ProductCollectionRepository extends Repository<ProductCollection> {
  public async queryCollections(
    relations: Array<keyof ProductCollection> = [],
    idsOrOptionsWithoutRelations: CustomOptions = {},
    shouldCount = false
  ): Promise<[ProductCollection[], number]> {
    let entities: ProductCollection[]
    let count = 0

    const getResults = async (
      qb: SelectQueryBuilder<ProductCollection>
    ): Promise<[ProductCollection[], number]> =>
      shouldCount ? await qb.getManyAndCount() : [await qb.getMany(), 0]

    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.findByIds(idsOrOptionsWithoutRelations)
      count = entities.length
    } else {
      let qb = this.createQueryBuilder("product_collection")
        .select(["product_collection.id"])
        .skip(idsOrOptionsWithoutRelations.skip)
        .take(idsOrOptionsWithoutRelations.take)

      qb = idsOrOptionsWithoutRelations.where
        ? qb.where(idsOrOptionsWithoutRelations.where)
        : qb

      qb = idsOrOptionsWithoutRelations.order
        ? qb.orderBy(idsOrOptionsWithoutRelations.order)
        : qb

      const result = await getResults(qb)
      entities = result[0]
      count = result[1]
    }

    const entitiesIds = entities.map(({ id }) => id)

    if (entitiesIds.length === 0) {
      // no need to continue
      return [[], 0]
    }

    if (relations.length === 0) {
      const result = await this.findByIds(
        entitiesIds,
        idsOrOptionsWithoutRelations
      )
      return [result, count]
    }

    const groupedRelations: { [toplevel: string]: string[] } = {}
    for (const rel of relations) {
      const [topLevel] = rel.split(".")
      if (groupedRelations[topLevel]) {
        groupedRelations[topLevel].push(rel)
      } else {
        groupedRelations[topLevel] = [rel]
      }
    }

    const entitiesIdsWithRelations = await Promise.all(
      Object.entries(groupedRelations).map(([toplevel, rels]) => {
        let querybuilder = this.createQueryBuilder("product_collections")

        querybuilder = querybuilder.leftJoinAndSelect(
          `product_collections.${toplevel}`,
          toplevel
        )

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

        querybuilder = querybuilder.where(
          "product_collections.deleted_at IS NULL AND product_collections.id IN (:...entitiesIds)",
          { entitiesIds }
        )

        querybuilder = idsOrOptionsWithoutRelations.order
          ? querybuilder.orderBy(idsOrOptionsWithoutRelations.order)
          : querybuilder

        return querybuilder.getMany()
      })
    ).then(flatten)

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")

    return [
      map(entities, (e) => merge({}, ...entitiesAndRelationsById[e.id])),
      count,
    ]
  }

  public async findWithRelations(
    relations: Array<keyof ProductCollection> = [],
    idsOrOptionsWithoutRelations: CustomOptions = {}
  ): Promise<ProductCollection[]> {
    const result = await this.queryCollections(
      relations,
      idsOrOptionsWithoutRelations
    )

    return result[0]
  }

  public async findWithRelationsAndCount(
    relations: Array<keyof ProductCollection> = [],
    idsOrOptionsWithoutRelations: CustomOptions = {}
  ): Promise<[ProductCollection[], number]> {
    return this.queryCollections(relations, idsOrOptionsWithoutRelations, true)
  }

  public async findOneWithRelations(
    relations: Array<keyof ProductCollection> = [],
    optionsWithoutRelations: CustomOptions = { where: {} }
  ): Promise<ProductCollection> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }
}
