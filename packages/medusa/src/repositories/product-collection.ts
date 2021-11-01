import { flatten, groupBy, map, merge } from "lodash"
import {
  EntityRepository,
  FindManyOptions,
  OrderByCondition,
  Repository,
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
  public async findWithRelations(
    relations: Array<keyof ProductCollection> = [],
    idsOrOptionsWithoutRelations: CustomOptions = {}
  ): Promise<ProductCollection[]> {
    let entities: ProductCollection[]
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.findByIds(idsOrOptionsWithoutRelations)
    } else {
      const qb = this.createQueryBuilder("product_collection")
        .select(["product_collection.id"])
        .where(idsOrOptionsWithoutRelations.where)
        .skip(idsOrOptionsWithoutRelations.skip)
        .take(idsOrOptionsWithoutRelations.take)
        .orderBy(idsOrOptionsWithoutRelations.order)

      entities = await qb.getMany()
    }

    const entitiesIds = entities.map(({ id }) => id)

    if (entitiesIds.length === 0) {
      // no need to continue
      return []
    }

    if (relations.length === 0) {
      return this.findByIds(entitiesIds, idsOrOptionsWithoutRelations)
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
      Object.entries(groupedRelations).map(([_, rels]) => {
        let querybuilder = this.createQueryBuilder("product_collections")

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
          "product_collections.deleted_at IS NULL AND product_collection.id IN (:...entitiesIds",
          { entitiesIds }
        )

        if (idsOrOptionsWithoutRelations.order) {
          // we must modify the order to avoid ambiguity of title:
          const [key, value] = Object.entries(
            idsOrOptionsWithoutRelations.order
          )[0]
          const order = { [`product_collections.${key}`]: value }

          querybuilder = querybuilder.orderBy(order)
        }

        return querybuilder.getMany()
      })
    ).then(flatten)

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")

    return map(entities, (e) => merge({}, ...entitiesAndRelationsById[e.id]))
  }

  public async findOneWithRelations(
    relations: Array<keyof ProductCollection> = [],
    optionsWithoutRelations: DefaultWithoutRelations = {}
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
