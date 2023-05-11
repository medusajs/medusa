import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductVariant } from "@models"
import { FindOptions as MikroOptions, LoadStrategy } from "@mikro-orm/core"
import { FindOptions, RepositoryService } from "../types"
import { deduplicateIfNecessary } from "../utils"

export class ProductVariantRepository
  implements RepositoryService<ProductVariant>
{
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager.fork()
  }

  async find(
    findOptions: FindOptions<ProductVariant> = {},
    context: { transaction?: any } = {}
  ): Promise<ProductVariant[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, options = {} } = { ...findOptions }

    options.limit ??= 15
    options.populate = deduplicateIfNecessary(options.populate)

    if (context.transaction) {
      Object.assign(options, { ctx: context.transaction })
    }

    Object.assign(options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.find(
      ProductVariant,
      where,
      options as MikroOptions<ProductVariant>
    )
  }

  async findAndCount(
    findOptions: FindOptions<ProductVariant> = {},
    context: { transaction?: any } = {}
  ): Promise<[ProductVariant[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, options = {} } = { ...findOptions }

    options.limit ??= 15
    options.populate = deduplicateIfNecessary(options.populate)

    if (context.transaction) {
      Object.assign(options, { ctx: context.transaction })
    }

    Object.assign(options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.findAndCount(
      ProductVariant,
      where,
      options as MikroOptions<ProductVariant>
    )
  }
}
