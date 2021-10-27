import { flatten, groupBy, map, merge } from "lodash"
import { EntityRepository, FindManyOptions, Repository } from "typeorm"
import { ProductCollection } from "../models/product-collection"

@EntityRepository(ProductCollection)
export class ProductCollectionRepository extends Repository<ProductCollection> {
  public async findWithRelations(
    relations: Array<keyof ProductCollection> = [],
    optionsWithoutRelations: Omit<
      FindManyOptions<ProductCollection>,
      "relations"
    > = {}
  ): Promise<ProductCollection[]> {
    const entities = await this.find(optionsWithoutRelations)
    const entitiesIds = entities.map(({ id }) => id)

    const groupedRelations = {}
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
        return this.findByIds(entitiesIds, {
          select: ["id"],
          relations: rels as string[],
        })
      })
    ).then(flatten)

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")

    return map(entities, (e) => merge({}, ...entitiesAndRelationsById[e.id]))
  }

  public async findOneWithRelations(
    relations: Array<keyof ProductCollection> = [],
    optionsWithoutRelations: Omit<
      FindManyOptions<ProductCollection>,
      "relations"
    > = {}
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
