import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductVariant } from "@models"
import { FindOptions as MikroFindOptions, LoadStrategy } from "@mikro-orm/core"
import { FindOptions, RepositoryService } from "../types"
import { deduplicateIfNecessary } from "../utils"

export class ProductVariantRepository
  implements RepositoryService<ProductVariant>
{
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager
  }

  async find(
    options: FindOptions<ProductVariant> = {},
    context: { transaction?: any } = {}
  ): Promise<ProductVariant[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, findOptions = {} } = { ...options }

    findOptions.limit ??= 15
    findOptions.populate = deduplicateIfNecessary(findOptions.populate)

    if (context.transaction) {
      Object.assign(findOptions, { ctx: context.transaction })
    }

    Object.assign(findOptions, {
      strategy: LoadStrategy.SELECT_IN,
      cache: 1000,
    })

    return await this.manager_.find(
      ProductVariant,
      where,
      findOptions as MikroFindOptions<ProductVariant>
    )
  }

  async findAndCount(
    options: FindOptions<ProductVariant> = {},
    context: { transaction?: any } = {}
  ): Promise<[ProductVariant[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, findOptions = {} } = { ...options }

    findOptions.limit ??= 15
    findOptions.populate = deduplicateIfNecessary(findOptions.populate)

    if (context.transaction) {
      Object.assign(findOptions, { ctx: context.transaction })
    }

    Object.assign(findOptions, {
      strategy: LoadStrategy.SELECT_IN,
      cache: 1000,
    })

    return await this.manager_.findAndCount(
      ProductVariant,
      where,
      findOptions as MikroFindOptions<ProductVariant>
    )
  }
}
