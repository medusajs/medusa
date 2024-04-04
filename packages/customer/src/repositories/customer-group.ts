import { Context, DAL } from "@medusajs/types"

import { CustomerGroup } from "@models"
import { mikroOrmBaseRepositoryFactory } from "@medusajs/utils"

export class CustomerGroupRepository extends mikroOrmBaseRepositoryFactory<CustomerGroup>(
  CustomerGroup
) {
  async find(
    findOptions: DAL.FindOptions<CustomerGroup & { q?: string }> = {
      where: {},
    },
    context: Context = {}
  ): Promise<CustomerGroup[]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    this.applyFreeTextSearchFilters<CustomerGroup>(
      findOptions_,
      this.getFreeTextSearchConstraints
    )

    return await super.find(findOptions_, context)
  }

  async findAndCount(
    findOptions: DAL.FindOptions<CustomerGroup & { q?: string }> = {
      where: {},
    },
    context: Context = {}
  ): Promise<[CustomerGroup[], number]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    this.applyFreeTextSearchFilters<CustomerGroup>(
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
