import { objectToStringPath } from "@medusajs/utils"
import { FindManyOptions, FindOptionsRelations } from "typeorm"
import { dataSource } from "../loaders/database"
import { Cart } from "../models"
import {
  getGroupedRelations,
  mergeEntitiesWithRelations,
  queryEntityWithIds,
} from "../utils/repository"

export const CartRepository = dataSource.getRepository(Cart).extend({
  async findWithRelations(
    relations: FindOptionsRelations<Cart> = {},
    optionsWithoutRelations: Omit<FindManyOptions<Cart>, "relations"> = {}
  ): Promise<Cart[]> {
    const entities = await this.find(optionsWithoutRelations)
    const entitiesIds = entities.map(({ id }) => id)

    const groupedRelations = getGroupedRelations(objectToStringPath(relations))

    const entitiesIdsWithRelations = await queryEntityWithIds({
      repository: this,
      entityIds: entitiesIds,
      groupedRelations,
      select: ["id"],
    })

    const entitiesAndRelations = entities.concat(entitiesIdsWithRelations)
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
