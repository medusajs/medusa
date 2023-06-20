import { objectToStringPath } from "@medusajs/utils"
import { flatten, groupBy, map, merge } from "lodash"
import { FindManyOptions, FindOptionsRelations, In } from "typeorm"
import { dataSource } from "../loaders/database"
import { Order } from "../models"

const ITEMS_REL_NAME = "items"
const REGION_REL_NAME = "region"

export const OrderRepository = dataSource.getRepository(Order).extend({
  async findWithRelationsAndCount(
    relations: FindOptionsRelations<Order> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {},
    { shouldCount }: { shouldCount?: boolean } = { shouldCount: true }
  ): Promise<[Order[], number]> {
    let entities: Order[] = []
    let count = 0

    if (shouldCount) {
      const result = await Promise.all([
        this.find(optionsWithoutRelations),
        this.count(optionsWithoutRelations),
      ])
      entities = result[0]
      count = result[1]
    } else {
      entities = await this.find(optionsWithoutRelations)
    }

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

    const orders = map(entities, (e) =>
      merge({}, ...entitiesAndRelationsById[e.id])
    )
    return [orders, count]
  },

  async findWithRelations(
    relations: FindOptionsRelations<Order> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<Order[]> {
    const [orders] = await this.findWithRelationsAndCount(
      relations,
      optionsWithoutRelations,
      { shouldCount: false }
    )

    return orders
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
