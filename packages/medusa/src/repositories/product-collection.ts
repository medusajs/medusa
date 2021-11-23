import { flatten, groupBy, map, merge } from "lodash"
import {
  EntityRepository,
  FindManyOptions,
  OrderByCondition,
  Repository,
} from "typeorm"
import { ProductCollection } from "../models/product-collection"
import prefix from "../utils/prefix-object-key"

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
      // add the column used for ordering, if we are ordering
      const fields = ["product_collection.id"]
      let { order } = idsOrOptionsWithoutRelations
      if (order) {
        // we must modify the order to avoid ambiguity of title:
        order = prefix(order, "product_collection")
        fields.push(Object.keys(order)[0])
      }

      const qb = this.createQueryBuilder("product_collection")
        .select(fields)
        .where(idsOrOptionsWithoutRelations.where)
        .skip(idsOrOptionsWithoutRelations.skip)
        .take(idsOrOptionsWithoutRelations.take)
        .orderBy(order)

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

        return querybuilder
          .where(
            "product_collections.deleted_at IS NULL AND product_collection.id IN (:...entitiesIds",
            { entitiesIds }
          )
          .orderBy(
            prefix(idsOrOptionsWithoutRelations.order, "product_collections")
          )
          .getMany()
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
