import { Context, DAL } from "@medusajs/types"

import { Customer } from "@models"
import { mikroOrmBaseRepositoryFactory } from "@medusajs/utils"

export class CustomerRepository extends mikroOrmBaseRepositoryFactory<Customer>(
  Customer
) {
  async find(
    findOptions: DAL.FindOptions<Customer & { q?: string }> = {
      where: {},
    },
    context: Context = {}
  ): Promise<Customer[]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    this.applyFreeTextSearchFilters<Customer>(
      findOptions_,
      this.getFreeTextSearchConstraints
    )

    return await super.find(findOptions_, context)
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Customer & { q?: string }> = {
      where: {},
    },
    context: Context = {}
  ): Promise<[Customer[], number]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    this.applyFreeTextSearchFilters<Customer>(
      findOptions_,
      this.getFreeTextSearchConstraints
    )

    return await super.findAndCount(findOptions_, context)
  }

  protected getFreeTextSearchConstraints(q: string) {
    return [
      {
        company_name: {
          $ilike: `%${q}%`,
        },
      },
      {
        first_name: {
          $ilike: `%${q}%`,
        },
      },
      {
        last_name: {
          $ilike: `%${q}%`,
        },
      },
      {
        email: {
          $ilike: `%${q}%`,
        },
      },
      {
        phone: {
          $ilike: `%${q}%`,
        },
      },
    ]
  }
}
