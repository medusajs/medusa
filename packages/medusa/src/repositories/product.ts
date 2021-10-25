import { flatten, groupBy, map, merge } from "lodash"
import {
  OrderByCondition,
  EntityRepository,
  FindManyOptions,
  Repository,
} from "typeorm"
import { Product } from "../models/product"

type DefaultWithoutRelations = Omit<FindManyOptions<Product>, "relations">

type CustomOptions = {
  where?: DefaultWithoutRelations["where"] & { tags?: string[] }
  order?: OrderByCondition
  skip?: number
  take?: number
}

type FindWithRelationsOptions = CustomOptions

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  public async findWithRelations(
    relations: Array<keyof Product> = [],
    idsOrOptionsWithoutRelations: FindWithRelationsOptions = {}
  ): Promise<Product[]> {
    let entities: Product[]
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.findByIds(idsOrOptionsWithoutRelations)
    } else {
      // Since tags are in a one-to-many realtion they cant be included in a
      // regular query, to solve this add the join on tags seperately if
      // the query exists
      const tags = idsOrOptionsWithoutRelations.where.tags
      delete idsOrOptionsWithoutRelations.where.tags
      let qb = this.createQueryBuilder("product")
        .select(["product.id"])
        .where(idsOrOptionsWithoutRelations.where)
        .skip(idsOrOptionsWithoutRelations.skip)
        .take(idsOrOptionsWithoutRelations.take)
        .orderBy(idsOrOptionsWithoutRelations.order)

      if (tags) {
        qb = qb
          .leftJoinAndSelect("product.tags", "tags")
          .andWhere(`tags.id IN (:...ids)`, { ids: tags._value })
      }

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
      Object.entries(groupedRelations).map(([toplevel, rels]) => {
        let querybuilder = this.createQueryBuilder("products")

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

        return querybuilder
          .where(
            "products.deleted_at IS NULL AND products.id IN (:...entitiesIds)",
            { entitiesIds }
          )
          .getMany()
      })
    ).then(flatten)

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
    return map(entitiesAndRelationsById, (entityAndRelations) =>
      merge({}, ...entityAndRelations)
    )
  }

  public async findOneWithRelations(
    relations: Array<keyof Product> = [],
    optionsWithoutRelations: Omit<FindManyOptions<Product>, "relations"> = {}
  ): Promise<Product> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }
}
