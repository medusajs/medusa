import { objectToStringPath } from "@medusajs/utils"
import { flatten } from "lodash"
import { FindManyOptions, FindOptionsRelations, In } from "typeorm"
import { dataSource } from "../loaders/database"
import { Cart } from "../models"
import {
  getGroupedRelations,
  mergeEntitiesWithRelations,
} from "../utils/repository"

export const CartRepository = dataSource.getRepository(Cart).extend({
  async findWithRelations(
    relations: FindOptionsRelations<Cart> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Cart>, "relations"> = {}
  ): Promise<Cart[]> {
    const entities = await this.find(optionsWithoutRelations)
    const entitiesIds = entities.map(({ id }) => id)

    const groupedRelations = getGroupedRelations(objectToStringPath(relations))

    const entitiesIdsWithRelations = await Promise.all(
      Object.entries(groupedRelations).map(async ([_, rels]) => {
        return this.find({
          where: { id: In(entitiesIds) },
          select: ["id"],
          relations: rels as string[],
        })
      })
    ).then(flatten)

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
    return mergeEntitiesWithRelations<Cart>(entitiesAndRelations)
  },

  async findOneWithRelations(
    relations: FindOptionsRelations<Cart> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Cart>, "relations"> = {}
  ): Promise<Cart> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  },
})
export default CartRepository
