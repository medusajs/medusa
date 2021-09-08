import { flatten, groupBy, map, merge } from "lodash"
import { EntityRepository, FindManyOptions, Repository } from "typeorm"
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
      entities = await this.find(idsOrOptionsWithoutRelations)
    }
    const entitiesIds = entities.map(({ id }) => id)

    const groupedRelations : { [toplevel: string]: string[]} = {}
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
          querybuilder = querybuilder.leftJoinAndSelect(`products.${toplevel}`, toplevel, "variants.deleted_at IS NULL")
            .orderBy({
                "variants.variant_rank": "ASC",
            })
        } else {
          querybuilder = querybuilder.leftJoinAndSelect(`products.${toplevel}`, toplevel) 
        }

        for(const rel of rels) {
          const [_, rest] = rel.split(".")
          if (!rest) {
            continue
          }
          // Regex matches all '.' except the rightmost
          querybuilder = querybuilder.leftJoinAndSelect(rel.replace(/\.(?=[^.]*\.)/g,"__"), rel.replace(".", "__"))
        }
         
        return querybuilder
          .where("products.deleted_at IS NULL AND products.id IN (:...entitiesIds)", { entitiesIds })
          .getMany();
      })
    ).then(flatten)
    
    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
    return map(entitiesAndRelationsById, entityAndRelations =>
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
