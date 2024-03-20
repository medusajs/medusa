import { Context, DAL } from "@medusajs/types"
import { InventoryItem, InventoryLevel } from "@models"

import { SqlEntityManager } from "@mikro-orm/postgresql"
import { mikroOrmBaseRepositoryFactory } from "@medusajs/utils"

export class InventoryItemRepository extends mikroOrmBaseRepositoryFactory<InventoryItem>(
  InventoryItem
) {
  async find(
    findOptions: DAL.FindOptions<InventoryItem & { q?: string }> = {
      where: {},
    },
    context: Context = {}
  ): Promise<InventoryItem[]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    this.applyFreeTextSearchFilters<InventoryItem>(
      findOptions_,
      this.getFreeTextSearchConstraints
    )

    return await super.find(findOptions_, context)
  }

  async findAndCount(
    findOptions: DAL.FindOptions<InventoryItem & { q?: string }> = {
      where: {},
    },
    context: Context = {}
  ): Promise<[InventoryItem[], number]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    this.applyFreeTextSearchFilters<InventoryItem>(
      findOptions_,
      this.getFreeTextSearchConstraints
    )

    return await super.findAndCount(findOptions_, context)
  }

  protected getFreeTextSearchConstraints(q: string) {
    return [
      {
        description: {
          $ilike: `%${q}%`,
        },
      },
      {
        title: {
          $ilike: `%${q}%`,
        },
      },
      {
        sku: {
          $ilike: `%${q}%`,
        },
      },
    ]
  }
}
