import { flatten, groupBy, map, merge, rest } from "lodash"
import { EntityRepository, FindManyOptions, Repository, SubjectWithoutIdentifierError } from "typeorm"
import { Product } from "../models/product"

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  public async findWithRelations(
    relations: Array<keyof Product> = [],
    idsOrOptionsWithoutRelations: Omit<
      FindManyOptions<Product>,
      "relations"
    > = {}
  ): Promise<Product[]> {
    let entities
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.findByIds(idsOrOptionsWithoutRelations)
    } else {
      let qb = this.createQueryBuilder("product")
        .select(["product.id"])
        
      // entities = await this.find(idsOrOptionsWithoutRelations)
      // throw new Error(JSON.stringify(idsOrOptionsWithoutRelations))
      
      
      // // await productService.list({ tags: ['id1', 'id2'] })
      
      // // if idsOr....tags {}
      // // }
      if(idsOrOptionsWithoutRelations.where.tags){ 
        qb = qb
          .leftJoinAndSelect("product.tags", "tags")
          .where(
            `tags.id IN (:...ids)`, { ids: idsOrOptionsWithoutRelations.where.tags._value}
          )
        delete idsOrOptionsWithoutRelations.where.tags
      }
        
      entities = await qb
        .andWhere(idsOrOptionsWithoutRelations.where)
        .getMany()
    }
    const entitiesIds = entities.map(({ id }) => id)

    if (entitiesIds.length === 0) {
      // no need to continue
      return []
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
