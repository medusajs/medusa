import { flatten, groupBy, map, merge } from "lodash"
import { EntityRepository, FindManyOptions, Repository } from "typeorm"
import { Order } from "../models"

const ITEMS_REL_NAME = "items"
const REGION_REL_NAME = "region"

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  public async findWithRelations(
    relations: string[] = [],
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<Order[]> {
    const entities = await this.find(optionsWithoutRelations)
    const entitiesIds = entities.map(({ id }) => id)

    const groupedRelations: { [topLevel: string]: string[] } = {}
    for (const rel of relations) {
      const [topLevel] = rel.split(".")
      if (groupedRelations[topLevel]) {
        groupedRelations[topLevel].push(rel)
      } else {
        groupedRelations[topLevel] = [rel]
      }
    }

    const entitiesIdsWithRelations = await Promise.all(
      Object.entries(groupedRelations).map(async ([topLevel, rels]) => {
        // If top level is region or items then get deleted region as well
        return this.findByIds(entitiesIds, {
          select: ["id"],
          relations: rels,
          withDeleted:
            topLevel === ITEMS_REL_NAME || topLevel === REGION_REL_NAME,
        })
      })
    ).then(flatten)

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")

    return map(entities, (e) => merge({}, ...entitiesAndRelationsById[e.id]))
  }

  public async findOneWithRelations(
    relations: string[] = [],
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<Order> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }
}
