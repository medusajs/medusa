import { Context, DAL } from "@medusajs/types"

import { StockLocation } from "@models"
import { mikroOrmBaseRepositoryFactory } from "@medusajs/utils"

export class StockLocationRepository extends mikroOrmBaseRepositoryFactory<StockLocation>(
  StockLocation
) {
  async find(
    findOptions: DAL.FindOptions<StockLocation & { q?: string }> = {
      where: {},
    },
    context: Context
  ): Promise<StockLocation[]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    this.applyFreeTextSearchFilters<StockLocation>(
      findOptions_,
      this.getFreeTextSearchConstraints
    )

    return await super.find(findOptions_, context)
  }

  async findAndCount(
    findOptions: DAL.FindOptions<StockLocation & { q?: string }> = {
      where: {},
    },
    context: Context
  ): Promise<[StockLocation[], number]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    this.applyFreeTextSearchFilters<StockLocation>(
      findOptions_,
      this.getFreeTextSearchConstraints
    )

    return await super.findAndCount(findOptions_, context)
  }

  protected getFreeTextSearchConstraints(q: string) {
    return [
      {
        name: {
          $ilike: `%${q}%`,
        },
      },
    ]
  }
}
