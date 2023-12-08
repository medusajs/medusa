import { objectToStringPath, promiseAll } from "@medusajs/utils"
import { flatten } from "lodash"
import { FindManyOptions, FindOptionsRelations, In } from "typeorm"
import { dataSource } from "../loaders/database"
import { Order } from "../models"
import {
  getGroupedRelations,
  mergeEntitiesWithRelations,
} from "../utils/repository"

const ITEMS_REL_NAME = "items"
const REGION_REL_NAME = "region"

export const OrderRepository = dataSource.getRepository(Order).extend({
  async findWithRelationsAndCount_(
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

    const groupedRelations = getGroupedRelations(objectToStringPath(relations))

    const entitiesIdsWithRelations = await promiseAll(
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

    const entitiesAndRelations = entities.concat(entitiesIdsWithRelations)
    return [mergeEntitiesWithRelations<Order>(entitiesAndRelations), count]
  },

  async findWithRelationsAndCount(
    relations: FindOptionsRelations<Order> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<[Order[], number]> {
    return this.findWithRelationsAndCount_(relations, optionsWithoutRelations, {
      shouldCount: true,
    })
  },

  async findOneWithRelations(
    relations: FindOptionsRelations<Order> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
  ): Promise<Order> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelationsAndCount_(
      relations,
      optionsWithoutRelations,
      { shouldCount: false }
    )

    return result[0][0]
  },
})

export default OrderRepository
