import { flatten, groupBy, map, merge } from "lodash"
import { FindManyOptions, FindOptionsRelations, In } from "typeorm"
import { Order } from "../models"
import { objectToStringPath } from "@medusajs/utils"
import { dataSource } from "../loaders/database"

const ITEMS_REL_NAME = "items"
const REGION_REL_NAME = "region"

export const OrderRepository = dataSource.getRepository(Order).extend({
  async findWithRelations(
    relations: FindOptionsRelations<Order> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<Order[]> {
    const entities = await this.find(optionsWithoutRelations)
    const entitiesIds = entities.map(({ id }) => id)

    const groupedRelations: { [topLevel: string]: string[] } = {}
    for (const rel of objectToStringPath(relations)) {
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
        return this.find({
          where: { id: In(entitiesIds) },
          select: ["id"],
          relations: rels,
          withDeleted:
            topLevel === ITEMS_REL_NAME || topLevel === REGION_REL_NAME,
          relationLoadStrategy: "join",
        })
      })
    ).then(flatten)

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")

    return map(entities, (e) => merge({}, ...entitiesAndRelationsById[e.id]))
  },

  async findOneWithRelations(
    relations: FindOptionsRelations<Order> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<Order> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  },
})

export default OrderRepository
