import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Product } from "@models"
import { FindOptions as MikroOptions, LoadStrategy } from "@mikro-orm/core"
import { FindOptions, RepositoryService } from "../types"
import { deduplicateIfNecessary } from "../utils"

export class ProductRepository implements RepositoryService<Product> {
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager.fork()
  }

  async find(
    findOptions: FindOptions<Product> = {},
    context: { transaction?: any } = {}
  ): Promise<Product[]> {
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
      Product,
      where,
      options as MikroOptions<Product>
    )
  }

  async findAndCount(
    findOptions: FindOptions<Product> = {},
    context: { transaction?: any } = {}
  ): Promise<[Product[], number]> {
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
      Product,
      where,
      options as MikroOptions<Product>
    )
  }
}
